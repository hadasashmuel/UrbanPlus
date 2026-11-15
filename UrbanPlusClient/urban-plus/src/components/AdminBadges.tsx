
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBadges,
  deleteBadge,
} from "../store/badges/badgesThunks";
import type { Badge } from "../store/badges/badgesState";
import "./AdminBadges.css";

function AdminBadges() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const badges = useAppSelector((state) => state.badges.badges);
  const loading = useAppSelector((state) => state.badges.loading);
  const error = useAppSelector((state) => state.badges.error);

  const [search, setSearch] = useState("");

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
                            src={badge.iconUrl}
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
