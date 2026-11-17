
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
import "./Map.css";

// =====================================
//          סמני המפה
// =====================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const getCategoryColor = (categoryId: number) => {
  const hue = ((categoryId * 137.508) % 360 + 360) % 360;
  return `hsl(${hue}, 75%, 45%)`;
};

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

const getSeverityLabel = (severity: number | string) => {
  const severities: Record<string, string> = {
    "0": "נמוכה",
    "1": "בינונית",
    "2": "גבוהה",
    "3": "קריטית",
  };

  return severities[String(severity)] ?? String(severity);
};

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
  //               תצוגה
  // =====================================

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
      {/* התראה קופצת בזמן אמת */}

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
          className="event-modal-overlay"
          onClick={() => setSelectedEventId(null)}
        >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal-close"
              onClick={() => setSelectedEventId(null)}
              aria-label="סגירת חלונית"
            >
              ×
            </button>

            {/* כותרת האירוע */}

            <div className="event-modal-header">
              <span
                className="event-category-badge"
                style={{
                  background: getCategoryColor(
                    selectedEvent.categoryId
                  ),
                }}
              >
                {selectedEvent.categoryName || "אירוע"}
              </span>

              <h2>{selectedEvent.title}</h2>

              <div className="event-header-info">
                <span className="event-status-badge">
                  <span className="status-dot" />
                  {getStatusLabel(selectedEvent.status)}
                </span>

                <span className="event-severity">
                  חומרה:{" "}
                  <strong>
                    {getSeverityLabel(selectedEvent.severity)}
                  </strong>
                </span>
              </div>
            </div>

            {/* כתובת */}

            <div className="event-address">
              <span className="event-info-icon">📍</span>

              <div>
                <small>מיקום האירוע</small>
                <strong>
                  {selectedEvent.address || "לא צוינה כתובת"}
                </strong>
              </div>
            </div>

            {/* הצבעות */}

            <div className="event-voting">
              <h3>האם האירוע עדיין קיים?</h3>

              {!token ? (
                <p className="event-login-message">
                  להתחברות ולהצבעה יש להתחבר למערכת
                </p>
              ) : loadingMyVotes ? (
                <p className="event-login-message">
                  טוען הצבעה...
                </p>
              ) : (
                <div className="event-vote-buttons">
                  <button
                    className={`event-vote-btn vote-yes ${
                      userVote?.typeVote === 0 ? "active" : ""
                    }`}
                    onClick={() => handleVote(0)}
                    disabled={creatingVote || deletingVote}
                  >
                    👍 קיים
                  </button>

                  <button
                    className={`event-vote-btn vote-no ${
                      userVote?.typeVote === 1 ? "active" : ""
                    }`}
                    onClick={() => handleVote(1)}
                    disabled={creatingVote || deletingVote}
                  >
                    👎 לא קיים
                  </button>
                </div>
              )}
            </div>

            {/* נתונים מרכזיים */}

            <div className="event-stats">
              <div className="event-stat-card reports-stat">
                <span className="event-stat-icon">📋</span>
                <strong>
                  {selectedEvent.countReports ?? 0}
                </strong>
                <small>דיווחים</small>
              </div>

              <div className="event-stat-card votes-stat">
                <span className="event-stat-icon">👍</span>
                <strong>
                  {selectedEvent.countVotes ?? 0}
                </strong>
                <small>הצבעות</small>
              </div>

              <div className="event-stat-card saved-stat">
                <span className="event-stat-icon">🔖</span>
                <strong>
                  {selectedEvent.countSavedEvents ?? 0}
                </strong>
                <small>עוקבים</small>
              </div>
            </div>

            {/* ציר זמן */}

            <div className="event-section">
              <h3 className="event-section-title">
                <span>◷</span>
                התקדמות האירוע
              </h3>

              <div className="event-timeline">
                <div className="timeline-item">
                  <span className="timeline-dot created-dot" />

                  <div>
                    <strong>האירוע דווח</strong>
                    <small>
                      {formatDate(selectedEvent.createdAt)}
                    </small>
                  </div>
                </div>

                <div className="timeline-item">
                  <span className="timeline-dot treatment-dot" />

                  <div>
                    <strong>תחילת טיפול</strong>
                    <small>
                      {formatDate(selectedEvent.startedAt)}
                    </small>
                  </div>
                </div>

                <div className="timeline-item">
                  <span className="timeline-dot resolved-dot" />

                  <div>
                    <strong>סיום טיפול</strong>
                    <small>
                      {formatDate(selectedEvent.resolvedAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* פרטים נוספים */}

            <div className="event-section">
              <h3 className="event-section-title">
                <span>ℹ</span>
                פרטים נוספים
              </h3>

              <div className="event-details-grid">
                <div className="event-detail-item">
                  <small>קטגוריה</small>
                  <strong>
                    {selectedEvent.categoryName || "לא צוינה"}
                  </strong>
                </div>

                <div className="event-detail-item">
                  <small>רמת חומרה</small>
                  <strong>
                    {getSeverityLabel(selectedEvent.severity)}
                  </strong>
                </div>

                <div className="event-detail-item">
                  <small>זמן טיפול משוער</small>
                  <strong>
                    {selectedEvent.estimatedResolutionMinutes != null
                      ? `${selectedEvent.estimatedResolutionMinutes} דקות`
                      : "לא עודכן"}
                  </strong>
                </div>

                <div className="event-detail-item">
                  <small>זמן טיפול בפועל</small>
                  <strong>
                    {selectedEvent.actualResolutionMinutes != null
                      ? `${selectedEvent.actualResolutionMinutes} דקות`
                      : "טרם הסתיים"}
                  </strong>
                </div>
              </div>
            </div>

            {/* מעקב */}

            <div className="event-follow-section">
              {!token ? (
                <p className="event-login-message">
                  כדי לעקוב אחר אירועים יש להתחבר למערכת.
                </p>
              ) : (
                <button
                  className={`event-follow-btn ${
                    savedEvent ? "following" : ""
                  }`}
                  onClick={handleSaveEvent}
                  disabled={
                    savingEvent ||
                    deletingSavedEvent ||
                    loadingSavedEvents
                  }
                >
                  {loadingSavedEvents
                    ? "טוען..."
                    : savingEvent
                      ? "מוסיף למעקב..."
                      : deletingSavedEvent
                        ? "מבטל מעקב..."
                        : savedEvent
                          ? "✓ במעקב – לחצי לביטול"
                          : "＋ עקוב אחר האירוע"}
                </button>
              )}
            </div>

            {/* הודעות */}

            <div className="event-messages-count">
              💬 {selectedEvent.messages?.length ?? 0} הודעות באירוע
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
