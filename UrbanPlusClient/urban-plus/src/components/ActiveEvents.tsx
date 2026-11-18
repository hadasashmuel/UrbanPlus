
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  fetchProvidersForEvent,
} from "../store/serviceProviders/serviceProvidersThunks";

import {
  clearEventProviders,
} from "../store/serviceProviders/serviceProvidersSlice";

import type { MainEvent } from "../store/events/eventsState";
import EventChat from "./EventChat";
import "./ActiveEvents.css";

const IMAGE_BASE_URL = "https://urbanpluspro.premiumasp.net";

function getReportImageUrl(imageUrl: string) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  if (imageUrl.startsWith("/")) {
    return `${IMAGE_BASE_URL}${imageUrl}`;
  }

  return `${IMAGE_BASE_URL}/images/${imageUrl}`;
}

function getStatusName(status: number | string) {
  const statusNames: Record<string, string> = {
    "0": "חדש",
    "1": "אומת",
    "2": "בטיפול",
    "3": "טופל",
    "4": "נסגר",
    New: "חדש",
    Verified: "אומת",
    InTreatment: "בטיפול",
    Treated: "טופל",
    Closed: "נסגר",
  };

  return statusNames[String(status)] ?? String(status);
}

function isActiveEvent(event: MainEvent) {
  const status = String(event.status);

  return ["0", "1", "2", "New", "Verified", "InTreatment"].includes(status);
}

function getSeverityName(severity: number | string) {
  const severities: Record<string, string> = {
    "0": "נמוכה",
    "1": "בינונית",
    "2": "גבוהה",
    "3": "קריטית",
  };

  return severities[String(severity)] ?? String(severity);
}

function formatDate(date: string | null) {
  if (!date) return "טרם עודכן";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "לא זמין";

  return parsedDate.toLocaleString("he-IL");
}

function getCategoryColor(categoryId: number) {
  const hue = ((categoryId * 137.508) % 360 + 360) % 360;
  return `hsl(${hue}, 75%, 45%)`;
}

function ActiveEvents() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  // ספקים המתאימים לאירוע בלבד
  const {
    eventServiceProviders,
    loadingEventProviders,
    eventProvidersError,
  } = useAppSelector((state) => state.serviceProviders);

  const token = useAppSelector((state) => state.users.token);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showProvidersModal, setShowProvidersModal] = useState(false);

  const activeEvents = mainEvents.filter(isActiveEvent);

  const selectedEvent = activeEvents.find(
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

  useEffect(() => {
    dispatch(fetchMainEvents());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchSavedEvents());
      dispatch(fetchMyVotes());
    }
  }, [dispatch, token]);

  const handleSaveEvent = () => {
    if (!selectedEvent || !token) return;

    if (savedEvent) {
      dispatch(deleteSavedEvent(savedEvent.savedEventId));
    } else {
      dispatch(saveEvent(selectedEvent.mainEventsId));
    }
  };

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

  // פתיחת רשימת הספקים המתאימים לאירוע הנבחר
  const handleOpenProviders = () => {
    if (!selectedEvent || !token) return;

    setShowProvidersModal(true);

    dispatch(
      fetchProvidersForEvent(selectedEvent.mainEventsId)
    );
  };

  // סגירת חלונית הספקים וניקוי הנתונים שלה
  const handleCloseProviders = () => {
    setShowProvidersModal(false);
    dispatch(clearEventProviders());
  };

  // סגירת חלונית האירוע
  const handleCloseEvent = () => {
    setSelectedEventId(null);
    setExpandedImage(null);
    setShowProvidersModal(false);
    dispatch(clearEventProviders());
  };

  const handleRetryProviders = () => {
    if (!selectedEvent) return;

    dispatch(
      fetchProvidersForEvent(selectedEvent.mainEventsId)
    );
  };

  const detailStyle: React.CSSProperties = {
    padding: "11px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
  };

  const voteStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "#e8f0ff" : "transparent",
    border: active ? "1px solid #93b4ed" : "1px solid transparent",
    borderRadius: "10px",
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: "14px",
    color: active ? "#2563eb" : "#374151",
    fontWeight: active ? "bold" : "normal",
    opacity: creatingVote || deletingVote ? 0.5 : 1,
  });

  return (
    <main className="active-events-page" dir="rtl">
      <header className="active-events-header">
        <button
          className="active-events-back"
          onClick={() => navigate(-1)}
        >
          → חזרה
        </button>

        <div className="active-events-heading">
          <span className="active-events-eyebrow">URBANPLUS</span>
          <h1>אירועים פעילים</h1>
          <p>כל המפגעים והאירועים שעדיין נמצאים בטיפול ברחבי העיר</p>
        </div>

        <div className="active-events-total">
          <strong>{activeEvents.length}</strong>
          <span>אירועים פעילים</span>
        </div>
      </header>

      {loadingMainEvents && (
        <div className="active-events-message">
          טוען את האירועים...
        </div>
      )}

      {!loadingMainEvents && error && (
        <div className="active-events-message error">{error}</div>
      )}

      {!loadingMainEvents && !error && activeEvents.length === 0 && (
        <div className="active-events-empty">
          <div className="empty-icon">🌿</div>
          <h2>איזה יופי! אין אירועים פעילים כרגע</h2>
          <p>נראה שכל האירועים טופלו. נמשיך לשמור על העיר שלנו!</p>
        </div>
      )}

      {!loadingMainEvents && activeEvents.length > 0 && (
        <section className="active-events-grid">
          {activeEvents.map((event) => (
            <button
              type="button"
              className="active-event-card"
              key={event.mainEventsId}
              onClick={() => setSelectedEventId(event.mainEventsId)}
              aria-label={`הצגת פרטי האירוע: ${event.title}`}
            >
              <div className="active-event-card-top">
                <span
                  className={`event-status status-${String(
                    event.status
                  ).toLowerCase()}`}
                >
                  {getStatusName(event.status)}
                </span>

                <span className="event-category">
                  {event.categoryName}
                </span>
              </div>

              <h2>{event.title}</h2>

              <p className="event-address">
                <span>📍</span> {event.address || "לא צוינה כתובת"}
              </p>

              <div className="event-details">
                <div className="event-detail">
                  <span className="detail-icon">⚠️</span>
                  <span>
                    חומרה: {getSeverityName(event.severity)}
                  </span>
                </div>

                <div className="event-detail">
                  <span className="detail-icon">📅</span>
                  <span>
                    נפתח בתאריך: {formatDate(event.createdAt)}
                  </span>
                </div>
              </div>

              <div className="event-card-footer">
                <span>📝 {event.countReports} דיווחים</span>
                <span>👍 {event.countVotes} הצבעות</span>
                <span>🔖 {event.countSavedEvents} שמירות</span>
              </div>

              <div className="event-card-open">
                לחצי לצפייה בפרטי האירוע ←
              </div>
            </button>
          ))}
        </section>
      )}

      {selectedEvent && (
        <div
          className="event-modal-overlay"
          onClick={handleCloseEvent}
        >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal-close"
              onClick={handleCloseEvent}
              aria-label="סגירת חלון"
            >
              ×
            </button>

            <div className="event-modal-layout">
              {/* צד ימין - פרטי האירוע */}
              <div className="event-modal-details">
                <div className="event-modal-heading">
                  <span
                    className="event-modal-category"
                    style={{
                      background: getCategoryColor(
                        selectedEvent.categoryId
                      ),
                    }}
                  >
                    {selectedEvent.categoryName || "אירוע"}
                  </span>

                  <h2>{selectedEvent.title}</h2>

                  <span className="event-modal-status">
                    {getStatusName(selectedEvent.status)}
                  </span>

                  <div className="event-modal-votes">
                    {!token ? (
                      <span>
                        להתחברות ולהצבעה יש להתחבר למערכת
                      </span>
                    ) : loadingMyVotes ? (
                      <span>טוען הצבעות...</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleVote(0)}
                          disabled={creatingVote || deletingVote}
                          style={voteStyle(userVote?.typeVote === 0)}
                        >
                          👍 קיים
                        </button>

                        <button
                          onClick={() => handleVote(1)}
                          disabled={creatingVote || deletingVote}
                          style={voteStyle(userVote?.typeVote === 1)}
                        >
                          👎 לא קיים
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="event-modal-section-title">
                  פרטי האירוע
                </h3>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>כתובת:</strong>{" "}
                  {selectedEvent.address || "לא צוינה כתובת"}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>קטגוריה:</strong>{" "}
                  {selectedEvent.categoryName || "לא צוינה"}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>חומרה:</strong>{" "}
                  {getSeverityName(selectedEvent.severity)}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>תאריך יצירה:</strong>{" "}
                  {formatDate(selectedEvent.createdAt)}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>תחילת טיפול:</strong>{" "}
                  {formatDate(selectedEvent.startedAt)}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>תאריך סיום:</strong>{" "}
                  {formatDate(selectedEvent.resolvedAt)}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>זמן טיפול משוער:</strong>{" "}
                  {selectedEvent.estimatedResolutionMinutes != null
                    ? `${selectedEvent.estimatedResolutionMinutes} דקות`
                    : "לא עודכן"}
                </div>

                <div className="event-modal-detail" style={detailStyle}>
                  <strong>זמן טיפול בפועל:</strong>{" "}
                  {selectedEvent.actualResolutionMinutes != null
                    ? `${selectedEvent.actualResolutionMinutes} דקות`
                    : "טרם הסתיים"}
                </div>

                {/* פנייה עצמאית לספקים */}
                <div
                  style={{
                    marginTop: "22px",
                    padding: "18px",
                    borderRadius: "14px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", color: "#1e40af" }}>
                    צריכים עזרה בטיפול במפגע?
                  </h3>

                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    תוכלו למצוא כאן ספקי שירות המתאימים לסוג האירוע
                    ולפנות אליהם ישירות.
                  </p>

                  <button
                    type="button"
                    onClick={handleOpenProviders}
                    disabled={!token}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 24px",
                      fontSize: "15px",
                      fontWeight: "bold",
                      cursor: token ? "pointer" : "not-allowed",
                      opacity: token ? 1 : 0.6,
                      width: "100%",
                    }}
                  >
                    📞 רוצים עזרה?
                  </button>

                  {!token && (
                    <p style={{ color: "#64748b", fontSize: "13px", marginBottom: 0 }}>
                      יש להתחבר למערכת כדי לצפות בפרטי הספקים.
                    </p>
                  )}
                </div>

                {/* תמונות מהדיווחים המשויכים לאירוע */}
                {selectedEvent.imageUrls?.length > 0 && (
                  <section
                    style={{
                      marginTop: "22px",
                      paddingTop: "16px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <h3 className="event-modal-section-title">
                      תמונות מהדיווחים ({selectedEvent.imageUrls.length})
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: "12px",
                        marginTop: "14px",
                      }}
                    >
                      {selectedEvent.imageUrls.map((imageUrl, index) => {
                        const imageSrc = getReportImageUrl(imageUrl);

                        return (
                          <button
                            type="button"
                            key={`${imageUrl}-${index}`}
                            onClick={() => setExpandedImage(imageSrc)}
                            aria-label={`הגדלת תמונה ${index + 1}`}
                            style={{
                              border: "none",
                              padding: 0,
                              background: "transparent",
                              cursor: "zoom-in",
                              borderRadius: "12px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={imageSrc}
                              alt={`תמונה מדיווח ${index + 1}`}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "110px",
                                objectFit: "cover",
                                display: "block",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.opacity = "0.3";
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                <div className="event-modal-stats">
                  <div>
                    <strong>{selectedEvent.countReports}</strong>
                    <span>דיווחים</span>
                  </div>

                  <div>
                    <strong>{selectedEvent.countVotes}</strong>
                    <span>הצבעות</span>
                  </div>

                  <div>
                    <strong>{selectedEvent.countSavedEvents}</strong>
                    <span>שמירות</span>
                  </div>
                </div>

                <div className="event-modal-follow">
                  {!token ? (
                    <p>
                      כדי לעקוב אחר אירועים יש להתחבר למערכת.
                    </p>
                  ) : (
                    <button
                      className={
                        savedEvent ? "event-follow-link" : ""
                      }
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
                              ? "לבטל מעקב"
                              : "לעקוב אחר האירוע"}
                    </button>
                  )}
                </div>
              </div>

              {/* צד שמאל - צ'אט */}
              <div className="event-modal-chat">
                <EventChat
                  mainEventId={selectedEvent.mainEventsId}
                />
              </div>
            </div>

            {/* חלונית ספקים מתאימים */}
            {showProvidersModal && (
              <div
                onClick={handleCloseProviders}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9000,
                  background: "rgba(15, 23, 42, 0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <div
                  dir="rtl"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "white",
                    width: "100%",
                    maxWidth: "620px",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    borderRadius: "20px",
                    padding: "25px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h2 style={{ margin: 0, color: "#1e293b" }}>
                      ספקים המתאימים לאירוע
                    </h2>

                    <button
                      type="button"
                      onClick={handleCloseProviders}
                      aria-label="סגירת רשימת ספקים"
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        fontSize: "23px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    הספקים המוצגים כאן מתאימים לקטגוריה של האירוע:
                    {" "}
                    <strong>{selectedEvent.categoryName}</strong>
                  </p>

                  {!token ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        background: "#fff7ed",
                        borderRadius: "12px",
                        color: "#9a3412",
                      }}
                    >
                      כדי לצפות בפרטי הספקים יש להתחבר למערכת.
                    </div>
                  ) : loadingEventProviders ? (
                    <div style={{ textAlign: "center", padding: "30px" }}>
                      <div style={{ fontSize: "30px", marginBottom: "10px" }}>
                        🔍
                      </div>
                      מחפשים ספקים המתאימים לאירוע...
                    </div>
                  ) : eventProvidersError ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        background: "#fef2f2",
                        borderRadius: "12px",
                        color: "#b91c1c",
                      }}
                    >
                      {eventProvidersError}

                      <button
                        type="button"
                        onClick={handleRetryProviders}
                        style={{
                          display: "block",
                          margin: "15px auto 0",
                          padding: "9px 18px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#2563eb",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        ניסיון חוזר
                      </button>
                    </div>
                  ) : eventServiceProviders.length === 0 ? (
                    <div
                      style={{
                        padding: "25px",
                        textAlign: "center",
                        background: "#f8fafc",
                        borderRadius: "12px",
                        color: "#64748b",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                        🔍
                      </div>

                      <strong>לא נמצאו ספקים מתאימים כרגע</strong>

                      <p style={{ fontSize: "13px", marginBottom: 0 }}>
                        כשיתווספו ספקים המשויכים לקטגוריה הזו,
                        הם יוצגו כאן.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginBottom: "12px",
                        }}
                      >
                        נמצאו {eventServiceProviders.length} ספקים מתאימים
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: "12px",
                        }}
                      >
                        {eventServiceProviders.map((provider) => (
                          <div
                            key={provider.providerId}
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: "14px",
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "12px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div>
                              <h3
                                style={{
                                  margin: "0 0 6px",
                                  color: "#1e293b",
                                  fontSize: "16px",
                                }}
                              >
                                {provider.fullName}
                              </h3>

                              <div
                                style={{
                                  color: "#64748b",
                                  fontSize: "13px",
                                }}
                              >
                                {provider.department || "ספק שירות"}
                              </div>

                              {provider.email && (
                                <div
                                  style={{
                                    color: "#64748b",
                                    fontSize: "13px",
                                    marginTop: "4px",
                                  }}
                                >
                                  ✉️ {provider.email}
                                </div>
                              )}
                            </div>

                            {provider.phone ? (
                              <a
                                href={`tel:${provider.phone}`}
                                style={{
                                  textDecoration: "none",
                                  background: "#ecfdf5",
                                  color: "#047857",
                                  border: "1px solid #a7f3d0",
                                  padding: "10px 16px",
                                  borderRadius: "10px",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                📞 {provider.phone}
                              </a>
                            ) : (
                              <span
                                style={{
                                  color: "#94a3b8",
                                  fontSize: "13px",
                                }}
                              >
                                לא הוזן מספר טלפון
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseProviders}
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "12px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#e2e8f0",
                      color: "#334155",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    סגירה
                  </button>
                </div>
              </div>
            )}

            {/* תצוגת תמונה מוגדלת */}
            {expandedImage && (
              <div
                onClick={() => setExpandedImage(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 10000,
                  background: "rgba(0, 0, 0, 0.88)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "30px",
                  cursor: "zoom-out",
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedImage(null)}
                  aria-label="סגירת תמונה מוגדלת"
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "25px",
                    border: "none",
                    background: "transparent",
                    color: "white",
                    fontSize: "38px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>

                <img
                  src={expandedImage}
                  alt="תמונה מוגדלת מהדיווח"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxWidth: "90vw",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    cursor: "default",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default ActiveEvents;
