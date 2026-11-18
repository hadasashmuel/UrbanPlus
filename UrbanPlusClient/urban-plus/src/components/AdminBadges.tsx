
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBadges,
  deleteBadge,
  createBadge,
  updateBadge,
} from "../store/badges/badgesThunks";
import type { Badge } from "../store/badges/badgesState";
import "./AdminBadges.css";

const API_BASE = "https://urbanpluspro.premiumasp.net";

const getImageSrc = (imageUrl: string): string => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  return `${API_BASE}/images/${imageUrl.replace(/^\/+/, "")}`;
};

function AdminBadges() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const badges = useAppSelector((state) => state.badges.badges);
  const loading = useAppSelector((state) => state.badges.loading);
  const error = useAppSelector((state) => state.badges.error);

  const [search, setSearch] = useState("");

  // מחיקה
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // הוספה ועריכה
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchBadges(token));
    }
  }, [dispatch, token]);

  const filteredBadges = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return badges;

    return badges.filter(
      (badge) =>
        badge.badgeName?.toLowerCase().includes(searchValue) ||
        badge.description?.toLowerCase().includes(searchValue)
    );
  }, [badges, search]);

  // ---------------- מחיקה ----------------

  const openDeleteModal = (badge: Badge) => {
    setSelectedBadge(badge);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedBadge(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!selectedBadge || !token) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await dispatch(
        deleteBadge({
          id: selectedBadge.badgeId,
          token,
        })
      ).unwrap();

      setShowDeleteModal(false);
      setSelectedBadge(null);
    } catch (err) {
      setDeleteError(
        typeof err === "string"
          ? err
          : "מחיקת התג נכשלה. נסי שוב"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ---------------- הוספה ועריכה ----------------

  const openCreateModal = () => {
    setFormMode("create");
    setEditingBadge(null);
    setFormName("");
    setFormDescription("");
    setFormImage(null);
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (badge: Badge) => {
    setFormMode("edit");
    setEditingBadge(badge);
    setFormName(badge.badgeName);
    setFormDescription(badge.description || "");
    setFormImage(null);
    setFormError("");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setEditingBadge(null);
    setFormName("");
    setFormDescription("");
    setFormImage(null);
    setFormError("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    if (!formName.trim() || !formDescription.trim()) {
      setFormError("יש למלא שם ותיאור לתג");
      return;
    }

    if (formMode === "create" && !formImage) {
      setFormError("יש לבחור תמונה לתג");
      return;
    }

    if (
      formImage &&
      !["image/jpeg", "image/png", "image/webp"].includes(formImage.type)
    ) {
      setFormError("ניתן להעלות תמונה מסוג JPG, PNG או WEBP בלבד");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (formMode === "create") {
        await dispatch(
          createBadge({
            token,
            badge: {
              badgeName: formName.trim(),
              description: formDescription.trim(),
              iconUrl: formImage!,
            },
          })
        ).unwrap();
      } else {
        if (!editingBadge) return;

        await dispatch(
          updateBadge({
            id: editingBadge.badgeId,
            token,
            badge: {
              badgeName: formName.trim(),
              description: formDescription.trim(),
              iconUrl: formImage,
            },
          })
        ).unwrap();
      }

      setShowFormModal(false);
      setEditingBadge(null);
      setFormName("");
      setFormDescription("");
      setFormImage(null);
      setFormError("");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : formMode === "create"
            ? "הוספת התג נכשלה. נסי שוב"
            : "עדכון התג נכשל. נסי שוב"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-badges-page admin-badges-embedded">
        <div className="admin-badges-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-badges-page admin-badges-embedded">
      <main className="admin-badges-content">
        <section className="admin-badges-summary">
          <div className="admin-badges-summary-icon">🏅</div>
          <div>
            <span>סה"כ תגים</span>
            <strong>{badges.length}</strong>
          </div>
        </section>

        <section className="admin-badges-card">
          <div className="admin-badges-toolbar">
            <div>
              <h2>רשימת תגים</h2>
              <p>צפייה וניהול התגים במערכת</p>
            </div>

            <div className="admin-badges-toolbar-actions">
              <button
                className="admin-badge-add-button"
                onClick={openCreateModal}
              >
                + הוספת תג
              </button>

              <div className="admin-badges-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="חיפוש לפי שם או תיאור..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="admin-badges-message">
              <div className="admin-badges-loader" />
              <p>טוען תגים...</p>
            </div>
          ) : error ? (
            <div className="admin-badges-error">
              {error}
              <button onClick={() => dispatch(fetchBadges(token))}>
                נסי שוב
              </button>
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="admin-badges-empty">
              <span>🔍</span>
              <h3>לא נמצאו תגים</h3>
              <p>
                {search
                  ? "נסי לחפש לפי שם או תיאור אחר"
                  : "עדיין אין תגים במערכת"}
              </p>
            </div>
          ) : (
            <div className="admin-badges-table-wrapper">
              <table className="admin-badges-table">
                <thead>
                  <tr>
                    <th>מזהה</th>
                    <th>תמונה</th>
                    <th>שם התג</th>
                    <th>תיאור</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBadges.map((badge) => (
                    <tr key={badge.badgeId}>
                      <td>{badge.badgeId}</td>

                      <td>
                        {badge.iconUrl ? (
                          <img
                            className="admin-badge-image"
                            src={getImageSrc(badge.iconUrl)}
                            alt={badge.badgeName}
                          />
                        ) : (
                          <span className="admin-badge-placeholder">
                            🏅
                          </span>
                        )}
                      </td>

                      <td>
                        <strong className="admin-badge-name">
                          {badge.badgeName}
                        </strong>
                      </td>

                      <td className="admin-badge-description">
                        {badge.description || "—"}
                      </td>

                      <td>
                        <div className="admin-badge-actions">
                          <button
                            className="admin-badge-edit-button"
                            onClick={() => openEditModal(badge)}
                          >
                            עריכה
                          </button>

                          <button
                            className="admin-badge-delete-button"
                            onClick={() => openDeleteModal(badge)}
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

          {!loading && !error && filteredBadges.length > 0 && (
            <div className="admin-badges-footer">
              מציג {filteredBadges.length} מתוך {badges.length} תגים
            </div>
          )}
        </section>
      </main>

      {/* חלונית הוספה ועריכה */}
      {showFormModal && (
        <div
          className="admin-badges-modal-overlay"
          onClick={closeFormModal}
        >
          <div
            className="admin-badges-form-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-badges-form-header">
              <div className="admin-badges-modal-icon">🏅</div>
              <h2>{formMode === "create" ? "הוספת תג חדש" : "עריכת תג"}</h2>
              <p>
                {formMode === "create"
                  ? "מלאי את הפרטים כדי להוסיף תג למערכת"
                  : "עדכני את פרטי התג"}
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-badges-form-field">
                <label htmlFor="badge-name">שם התג</label>
                <input
                  id="badge-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="הקלידי את שם התג"
                  maxLength={50}
                  required
                />
              </div>

              <div className="admin-badges-form-field">
                <label htmlFor="badge-description">תיאור התג</label>
                <textarea
                  id="badge-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="הקלידי תיאור קצר לתג"
                  maxLength={200}
                  rows={3}
                  required
                />
              </div>

              <div className="admin-badges-form-field">
                <label htmlFor="badge-image">
                  תמונת התג {formMode === "create" ? "(חובה)" : "(לא חובה)"}
                </label>

                <input
                  id="badge-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    setFormImage(e.target.files?.[0] || null)
                  }
                  required={formMode === "create"}
                />

                {formImage && (
                  <div className="admin-badges-selected-image">
                    <img
                      src={URL.createObjectURL(formImage)}
                      alt="תצוגה מקדימה"
                    />
                    <span>{formImage.name}</span>
                  </div>
                )}

                {!formImage && formMode === "edit" && editingBadge?.iconUrl && (
                  <div className="admin-badges-selected-image">
                    <img
                      src={getImageSrc(editingBadge.iconUrl)}
                      alt={editingBadge.badgeName}
                    />
                    <span>התמונה הנוכחית</span>
                  </div>
                )}
              </div>

              {formError && (
                <div className="admin-badges-modal-error">
                  {formError}
                </div>
              )}

              <div className="admin-badges-modal-actions">
                <button
                  type="button"
                  className="admin-badges-modal-cancel"
                  onClick={closeFormModal}
                  disabled={saving}
                >
                  ביטול
                </button>

                <button
                  type="submit"
                  className="admin-badges-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "שומר..."
                    : formMode === "create"
                      ? "הוספת תג"
                      : "שמירת שינויים"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* חלונית מחיקה */}
      {showDeleteModal && selectedBadge && (
        <div
          className="admin-badges-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="admin-badges-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-badge-delete-title"
          >
            <div className="admin-badges-modal-icon">!</div>

            <h2 id="admin-badge-delete-title">מחיקת תג</h2>

            <p>
              האם את בטוחה שברצונך למחוק את התג
              <strong> {selectedBadge.badgeName}</strong>?
            </p>

            {deleteError && (
              <div className="admin-badges-modal-error">
                {deleteError}
              </div>
            )}

            <div className="admin-badges-modal-actions">
              <button
                className="admin-badges-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                ביטול
              </button>

              <button
                className="admin-badges-delete-confirm"
                onClick={handleDelete}
                disabled={deleting}
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

export default AdminBadges;
