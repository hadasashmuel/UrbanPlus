
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAdminUsers,
  deleteAdminUser,
} from "../store/users/usersThunks";
import "./AdminUsers.css";

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

function AdminUsers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const currentUser = useAppSelector((state) => state.users.user);

  const users = useAppSelector((state) => state.users.adminUsers);
  const loading = useAppSelector((state) => state.users.adminUsersLoading);
  const error = useAppSelector((state) => state.users.adminUsersError);

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminUsers());
    }
  }, [dispatch, token]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return users;

    return users.filter((user) => {
      const fullName =
        `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  const selectedUser = users.find(
    (user) => user.userId === selectedUserId
  );

  const openDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    setReason("");
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setShowDeleteModal(false);
    setSelectedUserId(null);
    setReason("");
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (selectedUserId === null || isDeleting) return;

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 3) {
      setDeleteError("יש להזין סיבת מחיקה של לפחות 3 תווים");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const result = await dispatch(
        deleteAdminUser({
          userId: selectedUserId,
          reason: trimmedReason,
        })
      );

      if (deleteAdminUser.fulfilled.match(result)) {
        setShowDeleteModal(false);
        setSelectedUserId(null);
        setReason("");
        setDeleteError("");

        // שליפה מחדש של הרשימה לאחר מחיקה מוצלחת
        await dispatch(fetchAdminUsers());
      } else {
        setDeleteError(
          result.payload ?? "מחיקת המשתמש נכשלה"
        );
      }
    } catch {
      setDeleteError("אירעה שגיאה במהלך מחיקת המשתמש");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-page admin-users-embedded">
      <main className="admin-users-content">
        <section className="admin-users-summary">
          <div className="admin-summary-icon">👥</div>
          <div>
            <span>סה"כ משתמשים</span>
            <strong>{users.length}</strong>
          </div>
        </section>

        <section className="admin-users-card">
          <div className="admin-users-toolbar">
            <div>
              <h2>רשימת משתמשים</h2>
              <p>צפייה וניהול החשבונות במערכת</p>
            </div>

            <div className="admin-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="חיפוש לפי שם או אימייל..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-users-message">
              <div className="admin-loader" />
              <p>טוען משתמשים...</p>
            </div>
          ) : error ? (
            <div className="admin-users-error">
              {error}
              <button onClick={() => dispatch(fetchAdminUsers())}>
                נסי שוב
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-users-empty">
              <span>🔍</span>
              <h3>לא נמצאו משתמשים</h3>
              <p>
                {search
                  ? "נסי לחפש לפי שם או כתובת אימייל אחרת"
                  : "עדיין אין משתמשים להצגה"}
              </p>
            </div>
          ) : (
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>משתמש</th>
                    <th>אימייל</th>
                    <th>ציון אמינות</th>
                    <th>תאריך הצטרפות</th>
                    <th>תפקיד</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>
                        <div className="admin-user-info">
                          {user.profilePicture ? (
                            <img
                              src={getImageSrc(user.profilePicture)}
                              alt="תמונת משתמש"
                              className="admin-user-avatar"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="admin-user-avatar admin-user-placeholder">
                              👤
                            </div>
                          )}

                          <strong>
                            {user.firstName} {user.lastName}
                          </strong>
                        </div>
                      </td>

                      <td className="admin-user-email">
                        {user.email}
                      </td>

                      <td>
                        <span className="admin-user-score">
                          {user.scoreReliability}
                        </span>
                      </td>

                      <td>
                        {new Date(user.createdAt).toLocaleDateString(
                          "he-IL"
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            user.roleCode === 1
                              ? "admin-role admin-role-manager"
                              : "admin-role"
                          }
                        >
                          {user.roleCode === 1 ? "מנהל" : "משתמש"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-delete-button"
                          onClick={() => openDeleteModal(user.userId)}
                          disabled={
                            user.userId === currentUser?.userId ||
                            user.roleCode === 1
                          }
                          title={
                            user.userId === currentUser?.userId
                              ? "לא ניתן למחוק את החשבון המחובר"
                              : user.roleCode === 1
                                ? "לא ניתן למחוק מנהל"
                                : "מחיקת משתמש"
                          }
                        >
                          מחיקה
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="admin-users-footer">
              מציג {filteredUsers.length} מתוך {users.length} משתמשים
            </div>
          )}
        </section>
      </main>

      {showDeleteModal && selectedUser && (
        <div
          className="admin-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="admin-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-delete-title"
          >
            <div className="admin-modal-icon">!</div>

            <h2 id="admin-delete-title">מחיקת משתמש</h2>

            <p>
              האם את בטוחה שברצונך למחוק את המשתמש
              <strong>
                {" "}
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>
              ?
            </p>

            <label htmlFor="delete-reason">
              סיבת המחיקה <span>*</span>
            </label>

            <textarea
              id="delete-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setDeleteError("");
              }}
              placeholder="הזיני את הסיבה למחיקת המשתמש..."
              rows={3}
              disabled={isDeleting}
            />

            {deleteError && (
              <div className="admin-modal-error">
                {deleteError}
              </div>
            )}

            <div className="admin-modal-actions">
              <button
                className="admin-modal-cancel"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                ביטול
              </button>

              <button
                className="admin-modal-confirm"
                onClick={handleDelete}
                disabled={reason.trim().length < 3 || isDeleting}
              >
                {isDeleting ? "מוחק..." : "אישור מחיקה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
