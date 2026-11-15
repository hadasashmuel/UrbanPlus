
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchMainEvents,
  deleteMainEvent,
} from "../store/events/eventsThunks";
import type { MainEvent } from "../store/events/eventsState";
import "./AdminEvents.css";

function AdminEvents() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);

  const events = useAppSelector((state) => state.events.mainEvents);
  const loading = useAppSelector(
    (state) => state.events.loadingMainEvents
  );
  const deleting = useAppSelector(
    (state) => state.events.deletingMainEvent
  );
  const error = useAppSelector((state) => state.events.error);

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] =
    useState<MainEvent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedEventId, setSelectedEventId] =
    useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchMainEvents());
    }
  }, [dispatch, token]);

  const filteredEvents = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return events;

    return events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(searchValue) ||
        event.address?.toLowerCase().includes(searchValue) ||
        event.categoryName?.toLowerCase().includes(searchValue)
      );
    });
  }, [events, search]);

  const selectedDeleteEvent = events.find(
    (event) => event.mainEventsId === selectedEventId
  );

  const openDetailsModal = (event: MainEvent) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEvent(null);
  };

  const openDeleteModal = (eventId: number) => {
    setSelectedEventId(eventId);
    setReason("");
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEventId(null);
    setReason("");
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (selectedEventId === null) return;

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 3) {
      setDeleteError("יש להזין סיבת מחיקה של לפחות 3 תווים");
      return;
    }

    try {
      await dispatch(
        deleteMainEvent({
          mainEventId: selectedEventId,
          reason: trimmedReason,
        })
      ).unwrap();

      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        typeof error === "string"
          ? error
          : "מחיקת האירוע נכשלה. נסי שוב"
      );
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("he-IL");
  };

  const formatValue = (value: number | string | null) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    return String(value);
  };

  if (!token) {
    return (
      <div className="admin-events-page admin-events-embedded">
        <div className="admin-events-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-events-page admin-events-embedded">
      <main className="admin-events-content">
        <section className="admin-events-summary">
          <div className="admin-events-summary-icon">📋</div>
          <div>
            <span>סה"כ אירועים</span>
            <strong>{events.length}</strong>
          </div>
        </section>

        <section className="admin-events-card">
          <div className="admin-events-toolbar">
            <div>
              <h2>רשימת אירועים</h2>
              <p>צפייה בפרטי האירועים וניהול הרשומות במערכת</p>
            </div>

            <div className="admin-events-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="חיפוש לפי כותרת, כתובת או קטגוריה..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-events-message">
              <div className="admin-events-loader" />
              <p>טוען אירועים...</p>
            </div>
          ) : error ? (
            <div className="admin-events-error">
              {error}
              <button onClick={() => dispatch(fetchMainEvents())}>
                נסי שוב
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="admin-events-empty">
              <span>🔍</span>
              <h3>לא נמצאו אירועים</h3>
              <p>
                {search
                  ? "נסי לחפש לפי כותרת, כתובת או קטגוריה אחרת"
                  : "עדיין אין אירועים להצגה"}
              </p>
            </div>
          ) : (
            <div className="admin-events-table-wrapper">
              <table className="admin-events-table">
                <thead>
                  <tr>
                    <th>אירוע</th>
                    <th>קטגוריה</th>
                    <th>כתובת</th>
                    <th>סטטוס</th>
                    <th>חומרה</th>
                    <th>הצבעות</th>
                    <th>שמירות</th>
                    <th>דיווחים</th>
                    <th>תאריך יצירה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.mainEventsId}>
                      <td>
                        <strong className="admin-event-title">
                          {event.title}
                        </strong>
                      </td>

                      <td>
                        <span className="admin-event-category">
                          {event.categoryName || "—"}
                        </span>
                      </td>

                      <td className="admin-event-address">
                        {event.address || "—"}
                      </td>

                      <td>
                        <span className="admin-event-value">
                          {formatValue(event.status)}
                        </span>
                      </td>

                      <td>
                        <span className="admin-event-value">
                          {formatValue(event.severity)}
                        </span>
                      </td>

                      <td>{event.countVotes}</td>
                      <td>{event.countSavedEvents}</td>
                      <td>{event.countReports}</td>

                      <td>{formatDate(event.createdAt)}</td>

                      <td>
                        <div className="admin-event-actions">
                          <button
                            className="admin-event-details-button"
                            onClick={() => openDetailsModal(event)}
                          >
                            פרטים
                          </button>

                          <button
                            className="admin-event-delete-button"
                            onClick={() =>
                              openDeleteModal(event.mainEventsId)
                            }
                          >
                            מחיקה
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="admin-events-footer">
              מציג {filteredEvents.length} מתוך {events.length} אירועים
            </div>
          )}
        </section>
      </main>

      {showDetailsModal && selectedEvent && (
        <div
          className="admin-events-modal-overlay"
          onClick={closeDetailsModal}
        >
          <div
            className="admin-events-details-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-event-details-title"
          >
            <div className="admin-events-details-heading">
              <div>
                <h2 id="admin-event-details-title">פרטי האירוע</h2>
                <p>מידע מלא על האירוע במערכת</p>
              </div>

              <button
                className="admin-events-close-button"
                onClick={closeDetailsModal}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <div className="admin-events-details-grid">
              <div className="admin-events-detail-item">
                <span>מזהה אירוע</span>
                <strong>{selectedEvent.mainEventsId}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>כותרת</span>
                <strong>{selectedEvent.title}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>קטגוריה</span>
                <strong>{selectedEvent.categoryName || "—"}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>מזהה קטגוריה</span>
                <strong>{selectedEvent.categoryId}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>כתובת</span>
                <strong>{selectedEvent.address || "—"}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>סטטוס</span>
                <strong>{formatValue(selectedEvent.status)}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>חומרה</span>
                <strong>{formatValue(selectedEvent.severity)}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>זמן טיפול משוער</span>
                <strong>
                  {selectedEvent.estimatedResolutionMinutes} דקות
                </strong>
              </div>

              <div className="admin-events-detail-item">
                <span>תאריך יצירה</span>
                <strong>{formatDate(selectedEvent.createdAt)}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>תאריך התחלה</span>
                <strong>{formatDate(selectedEvent.startedAt)}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>תאריך סיום</span>
                <strong>{formatDate(selectedEvent.resolvedAt)}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>זמן טיפול בפועל</span>
                <strong>
                  {selectedEvent.actualResolutionMinutes === null
                    ? "—"
                    : `${selectedEvent.actualResolutionMinutes} דקות`}
                </strong>
              </div>

              <div className="admin-events-detail-item">
                <span>קו רוחב</span>
                <strong>{selectedEvent.latitude}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>קו אורך</span>
                <strong>{selectedEvent.longitude}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>מספר הצבעות</span>
                <strong>{selectedEvent.countVotes}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>מספר שמירות</span>
                <strong>{selectedEvent.countSavedEvents}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>מספר דיווחים</span>
                <strong>{selectedEvent.countReports}</strong>
              </div>

              <div className="admin-events-detail-item">
                <span>מספר הודעות</span>
                <strong>{selectedEvent.messages?.length ?? 0}</strong>
              </div>
            </div>

            <button
              className="admin-events-details-close"
              onClick={closeDetailsModal}
            >
              סגירה
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && selectedDeleteEvent && (
        <div
          className="admin-events-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="admin-events-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-event-delete-title"
          >
            <div className="admin-events-modal-icon">!</div>

            <h2 id="admin-event-delete-title">מחיקת אירוע</h2>

            <p>
              האם את בטוחה שברצונך למחוק את האירוע
              <strong> {selectedDeleteEvent.title}</strong>?
            </p>

            <label htmlFor="admin-event-delete-reason">
              סיבת המחיקה <span>*</span>
            </label>

            <textarea
              id="admin-event-delete-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setDeleteError("");
              }}
              placeholder="הזיני את הסיבה למחיקת האירוע..."
              rows={3}
            />

            {deleteError && (
              <div className="admin-events-modal-error">
                {deleteError}
              </div>
            )}

            <div className="admin-events-modal-actions">
              <button
                className="admin-events-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                ביטול
              </button>

              <button
                className="admin-events-modal-confirm"
                onClick={handleDelete}
                disabled={reason.trim().length < 3 || deleting}
              >
                {deleting ? "מוחק..." : "אישור מחיקה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
