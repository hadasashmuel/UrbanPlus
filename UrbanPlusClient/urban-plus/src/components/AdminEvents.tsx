
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchMainEvents,
  deleteMainEvent,
  updateMainEvent,
} from "../store/events/eventsThunks";
import { fetchCategories } from "../store/categories/categoriesThunks";
import type { MainEvent } from "../store/events/eventsState";
import "./AdminEvents.css";

interface EditForm {
  title: string;
  categoryId: string;
  status: string;
  severity: string;
  estimatedResolutionMinutes: string;
}

const statusOptions = [
  { value: 0, label: "חדש" },
  { value: 1, label: "אומת" },
  { value: 2, label: "בטיפול" },
  { value: 3, label: "טופל" },
  { value: 4, label: "נסגר" },
];

const severityOptions = [
  { value: 0, label: "נמוכה" },
  { value: 1, label: "בינונית" },
  { value: 2, label: "גבוהה" },
  { value: 3, label: "קריטית" },
];

const getEnumNumber = (
  value: number | string,
  options: { value: number; label: string }[],
  englishNames: string[]
): number => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return options.some((option) => option.value === value) ? value : 0;
  }

  const normalized = String(value).trim().toLowerCase();
  const numericValue = Number(normalized);

  if (
    normalized !== "" &&
    Number.isInteger(numericValue) &&
    options.some((option) => option.value === numericValue)
  ) {
    return numericValue;
  }

  const hebrewOption = options.find(
    (option) => option.label === normalized
  );

  if (hebrewOption) return hebrewOption.value;

  const englishIndex = englishNames.findIndex(
    (name) => name.toLowerCase() === normalized
  );

  return englishIndex >= 0 ? englishIndex : 0;
};

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
  const categories = useAppSelector(
    (state) => state.categories.categories
  );

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] =
    useState<MainEvent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedEventId, setSelectedEventId] =
    useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [editingEvent, setEditingEvent] =
    useState<MainEvent | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    categoryId: "",
    status: "0",
    severity: "0",
    estimatedResolutionMinutes: "",
  });
  const [editError, setEditError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchMainEvents());
      dispatch(fetchCategories());
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

  const openEditModal = (event: MainEvent) => {
    setEditingEvent(event);
    setEditError("");

    setEditForm({
      title: event.title ?? "",
      categoryId: String(event.categoryId ?? ""),
      status: String(
        getEnumNumber(event.status, statusOptions, [
          "New",
          "Verified",
          "InTreatment",
          "Treated",
          "Closed",
        ])
      ),
      severity: String(
        getEnumNumber(event.severity, severityOptions, [
          "Low",
          "Medium",
          "High",
          "Critical",
        ])
      ),
      estimatedResolutionMinutes: String(
        event.estimatedResolutionMinutes ?? ""
      ),
    });
  };

  const closeEditModal = () => {
    if (updating) return;

    setEditingEvent(null);
    setEditError("");
  };

  const handleEditChange = (
    field: keyof EditForm,
    value: string
  ) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setEditError("");
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;

    const trimmedTitle = editForm.title.trim();
    const categoryId = Number(editForm.categoryId);
    const estimatedMinutes = Number(
      editForm.estimatedResolutionMinutes
    );

    if (trimmedTitle.length < 2 || trimmedTitle.length > 100) {
      setEditError("הכותרת חייבת להכיל בין 2 ל־100 תווים");
      return;
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setEditError("יש לבחור קטגוריה");
      return;
    }

    if (
      !Number.isInteger(estimatedMinutes) ||
      estimatedMinutes <= 0
    ) {
      setEditError("יש להזין זמן טיפול משוער גדול מאפס");
      return;
    }

    try {
      setUpdating(true);
      setEditError("");

      await dispatch(
        updateMainEvent({
          mainEventId: editingEvent.mainEventsId,
          categoryId,
          title: trimmedTitle,
          status: Number(editForm.status),
          severity: Number(editForm.severity),
          estimatedResolutionMinutes: estimatedMinutes,
        })
      ).unwrap();

      setEditingEvent(null);
    } catch (updateError) {
      setEditError(
        typeof updateError === "string"
          ? updateError
          : "עדכון האירוע נכשל. נסי שוב"
      );
    } finally {
      setUpdating(false);
    }
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
    } catch (deleteError) {
      setDeleteError(
        typeof deleteError === "string"
          ? deleteError
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
                            className="admin-event-edit-button"
                            onClick={() => openEditModal(event)}
                          >
                            עריכה
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

      {editingEvent && (
        <div
          className="admin-events-modal-overlay"
          onClick={closeEditModal}
        >
          <div
            className="admin-events-edit-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-event-edit-title"
          >
            <div className="admin-events-details-heading">
              <div>
                <h2 id="admin-event-edit-title">עריכת אירוע</h2>
                <p>עדכון פרטי האירוע במערכת</p>
              </div>

              <button
                className="admin-events-close-button"
                onClick={closeEditModal}
                disabled={updating}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <div className="admin-events-edit-form">
              <label htmlFor="edit-event-title">כותרת האירוע</label>
              <input
                id="edit-event-title"
                type="text"
                value={editForm.title}
                maxLength={100}
                onChange={(e) =>
                  handleEditChange("title", e.target.value)
                }
              />

              <label htmlFor="edit-event-category">קטגוריה</label>
              <select
                id="edit-event-category"
                value={editForm.categoryId}
                onChange={(e) =>
                  handleEditChange("categoryId", e.target.value)
                }
              >
                <option value="">בחרי קטגוריה</option>
                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>

              <label htmlFor="edit-event-status">סטטוס</label>
              <select
                id="edit-event-status"
                value={editForm.status}
                onChange={(e) =>
                  handleEditChange("status", e.target.value)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label htmlFor="edit-event-severity">חומרה</label>
              <select
                id="edit-event-severity"
                value={editForm.severity}
                onChange={(e) =>
                  handleEditChange("severity", e.target.value)
                }
              >
                {severityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label htmlFor="edit-event-minutes">
                זמן טיפול משוער (בדקות)
              </label>
              <input
                id="edit-event-minutes"
                type="number"
                min="1"
                step="1"
                value={editForm.estimatedResolutionMinutes}
                onChange={(e) =>
                  handleEditChange(
                    "estimatedResolutionMinutes",
                    e.target.value
                  )
                }
              />
            </div>

            {editError && (
              <div className="admin-events-modal-error">
                {editError}
              </div>
            )}

            <div className="admin-events-modal-actions">
              <button
                className="admin-events-modal-cancel"
                onClick={closeEditModal}
                disabled={updating}
              >
                ביטול
              </button>

              <button
                className="admin-events-edit-save"
                onClick={handleUpdate}
                disabled={updating || categories.length === 0}
              >
                {updating ? "שומר..." : "שמירת שינויים"}
              </button>
            </div>

            {categories.length === 0 && (
              <p className="admin-events-edit-hint">
                הקטגוריות עדיין נטענות או שלא נמצאו קטגוריות במערכת
              </p>
            )}
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
