
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
import type { MainEvent } from "../store/events/eventsState";
import EventChat from "./EventChat";
import "./ActiveEvents.css";

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

  return ["0", "1", "2", "New", "Verified", "InTreatment"].includes(
    status
  );
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

  const token = useAppSelector((state) => state.users.token);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    null
  );

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
          onClick={() => setSelectedEventId(null)}
        >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal-close"
              onClick={() => setSelectedEventId(null)}
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
                          👍 לייק
                        </button>

                        <button
                          onClick={() => handleVote(1)}
                          disabled={creatingVote || deletingVote}
                          style={voteStyle(userVote?.typeVote === 1)}
                        >
                          👎 דיסלייק
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
          </div>
        </div>
      )}
    </main>
  );
}

export default ActiveEvents;
