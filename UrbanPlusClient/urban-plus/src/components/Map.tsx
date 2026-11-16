
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchMainEvents,
  fetchSavedEvents,
  saveEvent,
  deleteSavedEvent,
  fetchMyVotes,
  createVote,
  deleteVote,
} from "../store/events/eventsThunks";

import {
  clearRealtimeNotification,
} from "../store/notifications/notificationsSlice";

import {
  createNearbyNotifications,
} from "../store/notifications/notificationsThunks";

import {
  startNotificationConnection,
} from "../store/notifications/notificationsConnection";

import "../App.css";

// =====================================
//          סמני המפה
// =====================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// צבע קבוע לכל קטגוריה לפי CategoryId
const getCategoryColor = (categoryId: number) => {
  const hue = ((categoryId * 137.508) % 360 + 360) % 360;
  return `hsl(${hue}, 75%, 45%)`;
};

// יצירת סמן צבעוני
const getEventIcon = (categoryId: number) => {
  const color = getCategoryColor(categoryId);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// =====================================
//          תרגום סטטוסים
// =====================================

const getStatusLabel = (status: number | string) => {
  const statuses: Record<string, string> = {
    "0": "חדש",
    "1": "מאומת",
    "2": "בטיפול",
    "3": "טופל",
    "4": "נסגר",
    New: "חדש",
    Verified: "מאומת",
    InTreatment: "בטיפול",
    Treated: "טופל",
    Closed: "נסגר",
  };

  return statuses[String(status)] ?? String(status);
};

// תרגום חומרה
const getSeverityLabel = (severity: number | string) => {
  const severities: Record<string, string> = {
    "0": "נמוכה",
    "1": "בינונית",
    "2": "גבוהה",
    "3": "קריטית",
  };

  return severities[String(severity)] ?? String(severity);
};

// הצגת תאריך
const formatDate = (date: string | null) => {
  if (!date) return "טרם עודכן";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "לא זמין";

  return parsedDate.toLocaleString("he-IL");
};

// =====================================
//          עדכון מרכז המפה
// =====================================

function ChangeView({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// =====================================
//              קומפוננטת המפה
// =====================================

function Map() {
  const dispatch = useAppDispatch();

  const {
    mainEvents,
    savedEvents,
    votes,
    loadingMainEvents,
    loadingSavedEvents,
    loadingMyVotes,
    savingEvent,
    deletingSavedEvent,
    creatingVote,
    deletingVote,
    error,
  } = useAppSelector((state) => state.events);

  const token = useAppSelector((state) => state.users.token);

  // התראה חדשה שהתקבלה דרך SignalR
  const realtimeNotification = useAppSelector(
    (state) => state.notifications.realtimeNotification
  );

  const [selectedEventId, setSelectedEventId] =
    useState<number | null>(null);

  const [position, setPosition] = useState<[number, number]>([
    32.0853,
    34.7818,
  ]);

  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  const [locationReady, setLocationReady] = useState(false);

  // האם חיבור SignalR מוכן לקבלת התראות
  const [notificationConnectionReady, setNotificationConnectionReady] =
    useState(false);

  const lastNearbyRequest = useRef<string | null>(null);

  const selectedEvent = mainEvents.find(
    (event) => event.mainEventsId === selectedEventId
  );

  const savedEvent = selectedEvent
    ? savedEvents.find(
        (item) => item.mainEventId === selectedEvent.mainEventsId
      )
    : undefined;

  const userVote = selectedEvent
    ? votes.find(
        (vote) => vote.mainEventId === selectedEvent.mainEventsId
      )
    : undefined;

  // =====================================
  //       חיבור SignalR להתראות
  // =====================================

  useEffect(() => {
    if (!token) {
      setNotificationConnectionReady(false);
      return;
    }

    let cancelled = false;

    let connection:
      | Awaited<ReturnType<typeof startNotificationConnection>>
      | null = null;

    setNotificationConnectionReady(false);

    startNotificationConnection(token, dispatch)
      .then((newConnection) => {
        if (cancelled) {
          newConnection.stop();
        } else {
          connection = newConnection;
          setNotificationConnectionReady(true);
        }
      })
      .catch((error) => {
        console.error("SignalR connection failed:", error);
      });

    return () => {
      cancelled = true;
      setNotificationConnectionReady(false);
      connection?.stop();
    };
  }, [token, dispatch]);

  // =====================================
  //             טעינת נתונים
  // =====================================

  useEffect(() => {
    dispatch(fetchMainEvents());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchSavedEvents());
      dispatch(fetchMyVotes());
    }
  }, [dispatch, token]);

  // =====================================
  //       הצגת התראות בזמן אמת
  // =====================================

  useEffect(() => {
    if (!realtimeNotification) return;

    const timeout = window.setTimeout(() => {
      dispatch(clearRealtimeNotification());
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [realtimeNotification, dispatch]);

  // =====================================
  //             איתור מיקום
  // =====================================

  useEffect(() => {
    let active = true;

    if (!navigator.geolocation) {
      setLocationError("הדפדפן אינו תומך באיתור מיקום");
      setLoading(false);

      return () => {
        active = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!active) return;

        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setPosition([latitude, longitude]);
        setLocationReady(true);
        setLoading(false);
        setLocationError("");
      },
      (err) => {
        if (!active) return;

        console.error("שגיאה באיתור מיקום:", err);

        setLocationError(
          err.code === 1
            ? "לא ניתנה הרשאה לאיתור המיקום"
            : "לא הצלחנו לאתר את המיקום שלך"
        );

        setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, []);

  // =====================================
  //       שליחת מיקום ליצירת התראות
  // =====================================

  useEffect(() => {
    if (
      !token ||
      !locationReady ||
      !notificationConnectionReady
    ) {
      return;
    }

    const requestKey = `${token}:${position[0]}:${position[1]}`;

    if (lastNearbyRequest.current === requestKey) return;

    lastNearbyRequest.current = requestKey;

    dispatch(
      createNearbyNotifications({
        latitude: position[0],
        longitude: position[1],
      })
    )
      .unwrap()
      .catch((error) => {
        console.error(
          "שגיאה ביצירת התראות בקרבת המשתמש:",
          error
        );

        lastNearbyRequest.current = null;
      });
  }, [
    dispatch,
    token,
    locationReady,
    position,
    notificationConnectionReady,
  ]);

  // =====================================
  //             שמירת אירוע
  // =====================================

  const handleSaveEvent = () => {
    if (!selectedEvent || !token) return;

    if (savedEvent) {
      dispatch(deleteSavedEvent(savedEvent.savedEventId));
    } else {
      dispatch(saveEvent(selectedEvent.mainEventsId));
    }
  };

  // =====================================
  //               הצבעה
  // =====================================

  const handleVote = async (typeVote: number) => {
    if (!selectedEvent || !token || creatingVote || deletingVote) {
      return;
    }

    if (!userVote) {
      dispatch(
        createVote({
          mainEventId: selectedEvent.mainEventsId,
          typeVote,
        })
      );

      return;
    }

    if (userVote.typeVote === typeVote) {
      dispatch(deleteVote(userVote.voteId));
      return;
    }

    try {
      await dispatch(deleteVote(userVote.voteId)).unwrap();

      dispatch(
        createVote({
          mainEventId: selectedEvent.mainEventsId,
          typeVote,
        })
      );
    } catch (error) {
      console.error("שגיאה בהחלפת הצבעה:", error);
    }
  };

  // =====================================
  //           עיצוב קישורים
  // =====================================

  const linkStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    padding: 0,
    color: "#374151",
    fontSize: "14px",
    textDecoration: "underline",
    cursor: "pointer",
  };

  const detailStyle: React.CSSProperties = {
    padding: "11px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
  };

  const voteStyle = (active: boolean): React.CSSProperties => ({
    background: "transparent",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    fontSize: "16px",
    color: active ? "#2563eb" : "#374151",
    fontWeight: active ? "bold" : "normal",
    opacity: creatingVote || deletingVote ? 0.5 : 1,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ================================= */}
      {/*       התראה קופצת בזמן אמת         */}
      {/* ================================= */}

      {token && realtimeNotification && (
        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "20px",
            zIndex: 3000,
            width: "340px",
            maxWidth: "calc(100vw - 40px)",
            background: "white",
            borderRight: "5px solid #789b83",
            borderRadius: "14px",
            padding: "20px",
            direction: "rtl",
            boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            animation: "notificationSlideIn 0.3s ease-out",
          }}
        >
          <button
            onClick={() =>
              dispatch(clearRealtimeNotification())
            }
            style={{
              position: "absolute",
              left: "10px",
              top: "7px",
              border: "none",
              background: "transparent",
              fontSize: "22px",
              color: "#777",
              cursor: "pointer",
            }}
            aria-label="סגירת התראה"
          >
            ×
          </button>

          <span style={{ fontSize: "26px" }}>🔔</span>

          <div>
            <strong
              style={{
                display: "block",
                color: "#456b52",
                fontSize: "16px",
                marginBottom: "8px",
              }}
            >
              התראה חדשה!
            </strong>

            <p
              style={{
                margin: 0,
                color: "#374151",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {realtimeNotification.content}
            </p>

            {realtimeNotification.titleMainEvent && (
              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#789b83",
                }}
              >
                {realtimeNotification.titleMainEvent}
              </small>
            )}
          </div>
        </div>
      )}

      {/* הודעת מיקום */}
      {locationError && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "20px",
            zIndex: 1000,
            background: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            direction: "rtl",
          }}
        >
          {locationError}
        </div>
      )}

      {/* שגיאה בטעינת אירועים */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "130px",
            right: "20px",
            zIndex: 1000,
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 18px",
            borderRadius: "10px",
            direction: "rtl",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* טעינת אירועים */}
      {loadingMainEvents && (
        <div
          style={{
            position: "absolute",
            top: "180px",
            right: "20px",
            zIndex: 1000,
            background: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            direction: "rtl",
          }}
        >
          טוען אירועים...
        </div>
      )}

      {/* ================================= */}
      {/*                 מפה                */}
      {/* ================================= */}

      <MapContainer
        center={position}
        zoom={19}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ChangeView center={position} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            {loading
              ? "מאתר מיקום..."
              : locationError
                ? "מיקום ברירת מחדל"
                : "המיקום הנוכחי שלך"}
          </Popup>
        </Marker>

        {mainEvents.map((event) => (
          <Marker
            key={event.mainEventsId}
            position={[
              event.latitude,
              event.longitude,
            ]}
            icon={getEventIcon(event.categoryId)}
            eventHandlers={{
              click: () =>
                setSelectedEventId(event.mainEventsId),
            }}
          />
        ))}
      </MapContainer>

      {/* ================================= */}
      {/*          חלון פרטי האירוע          */}
      {/* ================================= */}

      {selectedEvent && (
        <div
          onClick={() => setSelectedEventId(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            direction: "rtl",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              padding: "25px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedEventId(null)}
              style={{
                position: "absolute",
                left: "18px",
                top: "15px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                fontSize: "21px",
                cursor: "pointer",
                color: "#374151",
              }}
            >
              ×
            </button>

            <div
              style={{
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "18px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: getCategoryColor(
                    selectedEvent.categoryId
                  ),
                  color: "white",
                  padding: "5px 13px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                {selectedEvent.categoryName || "אירוע"}
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "23px",
                  color: "#111827",
                }}
              >
                {selectedEvent.title}
              </h2>

              <span
                style={{
                  display: "inline-block",
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "6px 13px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {getStatusLabel(selectedEvent.status)}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginTop: "16px",
                }}
              >
                {!token ? (
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    להתחברות ולהצבעה יש להתחבר למערכת
                  </span>
                ) : loadingMyVotes ? (
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    טוען...
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleVote(0)}
                      disabled={creatingVote || deletingVote}
                      style={voteStyle(userVote?.typeVote === 0)}
                      title="לייק"
                    >
                      👍 קיים
                    </button>

                    <button
                      onClick={() => handleVote(1)}
                      disabled={creatingVote || deletingVote}
                      style={voteStyle(userVote?.typeVote === 1)}
                      title="דיסלייק"
                    >
                      👎 לא קיים
                    </button>
                  </>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: "17px", color: "#111827" }}>
              פרטי האירוע
            </h3>

            <div style={detailStyle}>
              <strong>כתובת:</strong>{" "}
              {selectedEvent.address || "לא צוינה כתובת"}
            </div>

            <div style={detailStyle}>
              <strong>קטגוריה:</strong>{" "}
              {selectedEvent.categoryName || "לא צוינה"}
            </div>

            <div style={detailStyle}>
              <strong>חומרה:</strong>{" "}
              {getSeverityLabel(selectedEvent.severity)}
            </div>

            <div style={detailStyle}>
              <strong>תאריך יצירה:</strong>{" "}
              {formatDate(selectedEvent.createdAt)}
            </div>

            <div style={detailStyle}>
              <strong>תחילת טיפול:</strong>{" "}
              {formatDate(selectedEvent.startedAt)}
            </div>

            <div style={detailStyle}>
              <strong>תאריך סיום:</strong>{" "}
              {formatDate(selectedEvent.resolvedAt)}
            </div>

            <div style={detailStyle}>
              <strong>זמן טיפול משוער:</strong>{" "}
              {selectedEvent.estimatedResolutionMinutes} דקות
            </div>

            <div style={detailStyle}>
              <strong>זמן טיפול בפועל:</strong>{" "}
              {selectedEvent.actualResolutionMinutes != null
                ? `${selectedEvent.actualResolutionMinutes} דקות`
                : "טרם הסתיים"}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                margin: "20px 0",
              }}
            >
              <div
                style={{
                  background: "#f0fdf4",
                  borderRadius: "12px",
                  padding: "12px 5px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "23px", fontWeight: "bold" }}>
                  {selectedEvent.countReports}
                </div>
                <div style={{ fontSize: "12px", color: "#166534" }}>
                  דיווחים
                </div>
              </div>

              <div
                style={{
                  background: "#eff6ff",
                  borderRadius: "12px",
                  padding: "12px 5px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "23px", fontWeight: "bold" }}>
                  {selectedEvent.countVotes}
                </div>
                <div style={{ fontSize: "12px", color: "#1d4ed8" }}>
                  הצבעות
                </div>
              </div>

              <div
                style={{
                  background: "#faf5ff",
                  borderRadius: "12px",
                  padding: "12px 5px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "23px", fontWeight: "bold" }}>
                  {selectedEvent.countSavedEvents}
                </div>
                <div style={{ fontSize: "12px", color: "#7e22ce" }}>
                  שמירות
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "18px",
                marginTop: "10px",
              }}
            >
              {!token ? (
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  כדי לעקוב אחר אירועים יש להתחבר למערכת.
                </p>
              ) : (
                <button
                  onClick={handleSaveEvent}
                  disabled={
                    savingEvent ||
                    deletingSavedEvent ||
                    loadingSavedEvents
                  }
                  style={{
                    ...linkStyle,
                    opacity:
                      savingEvent ||
                      deletingSavedEvent ||
                      loadingSavedEvents
                        ? 0.5
                        : 1,
                  }}
                >
                  {loadingSavedEvents
                    ? "טוען..."
                    : savingEvent
                      ? "מוסיף למעקב..."
                      : deletingSavedEvent
                        ? "מבטל מעקב..."
                        : savedEvent
                          ? "לבטל מעקב"
                          : "במעקב"}
                </button>
              )}
            </div>

            <div
              style={{
                marginTop: "20px",
                color: "#6b7280",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {selectedEvent.messages?.length ?? 0} הודעות באירוע
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
