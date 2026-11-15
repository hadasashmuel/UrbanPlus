
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllNotifications } from "../store/notifications/notificationsThunks";
import type { NotificationItem } from "../store/notifications/notificationsState";
import "./AdminNotifications.css";

type FilterType = "all" | "read" | "unread";

function AdminNotifications() {
  const dispatch = useAppDispatch();

  const {
    adminNotifications,
    adminLoading,
    adminError,
  } = useAppSelector((state) => state.notifications);

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  const unreadCount = adminNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readCount = adminNotifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    return adminNotifications.filter((notification) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "read" && notification.isRead) ||
        (filter === "unread" && !notification.isRead);

      const searchText = search.toLowerCase();

      const matchesSearch =
        notification.content?.toLowerCase().includes(searchText) ||
        notification.titleMainEvent?.toLowerCase().includes(searchText) ||
        String(notification.userId).includes(searchText) ||
        String(notification.notificationId).includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [adminNotifications, filter, search]);

  const getTypeLabel = (type: NotificationItem["type"]) => {
    if (typeof type === "number") {
      return `סוג ${type}`;
    }

    return type || "התראה";
  };

  return (
    <div className="admin-notifications-page" dir="rtl">

      <div className="admin-notifications-header">
        <div>
          <h1>ניהול התראות</h1>
          <p>צפייה ומעקב אחר ההתראות שנשלחו למשתמשי המערכת</p>
        </div>

        <button
          className="notifications-refresh-btn"
          onClick={() => dispatch(fetchAllNotifications())}
          disabled={adminLoading}
        >
          {adminLoading ? "טוען..." : "↻ רענון התראות"}
        </button>
      </div>

      {/* סטטיסטיקות */}
      <div className="notifications-stats">

        <div className="notification-stat-card total">
          <span className="stat-icon">🔔</span>
          <div>
            <span className="stat-label">סך ההתראות</span>
            <strong>{adminNotifications.length}</strong>
          </div>
        </div>

        <div className="notification-stat-card unread">
          <span className="stat-icon">📩</span>
          <div>
            <span className="stat-label">לא נקראו</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="notification-stat-card read">
          <span className="stat-icon">✓</span>
          <div>
            <span className="stat-label">נקראו</span>
            <strong>{readCount}</strong>
          </div>
        </div>

      </div>

      {/* חיפוש וסינון */}
      <div className="notifications-toolbar">

        <input
          type="text"
          placeholder="חיפוש לפי תוכן, אירוע או מזהה משתמש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="notifications-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            הכל
          </button>

          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            לא נקראו
          </button>

          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => setFilter("read")}
          >
            נקראו
          </button>
        </div>

      </div>

      {/* טעינה */}
      {adminLoading && (
        <div className="notifications-message">
          טוען התראות...
        </div>
      )}

      {/* שגיאה */}
      {!adminLoading && adminError && (
        <div className="notifications-error">
          {adminError}
        </div>
      )}

      {/* רשימת התראות */}
      {!adminLoading && !adminError && (
        <div className="admin-notifications-list">

          {filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <span>🔔</span>
              <h3>לא נמצאו התראות</h3>
              <p>לא נמצאו התראות התואמות לחיפוש או לסינון שבחרת</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                className={`admin-notification-card ${
                  notification.isRead ? "is-read" : "is-unread"
                }`}
                key={notification.notificationId}
              >

                <div className="notification-card-icon">
                  🔔
                </div>

                <div className="notification-card-content">

                  <div className="notification-card-top">
                    <h3>
                      {notification.titleMainEvent || "התראת מערכת"}
                    </h3>

                    <span
                      className={`notification-status ${
                        notification.isRead ? "read" : "unread"
                      }`}
                    >
                      {notification.isRead ? "נקראה" : "לא נקראה"}
                    </span>
                  </div>

                  <p className="notification-content">
                    {notification.content}
                  </p>

                  <div className="notification-details">
                    <span>
                      משתמש: #{notification.userId}
                    </span>

                    <span>
                      מזהה התראה: #{notification.notificationId}
                    </span>

                    <span>
                      אירוע: #{notification.mainEventId}
                    </span>

                    <span>
                      סוג: {getTypeLabel(notification.type)}
                    </span>

                    <span>
                      מרחק מהאירוע: {notification.distanceFromEvent} ק"מ
                    </span>
                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      )}

      <div className="notifications-results-count">
        מוצגות {filteredNotifications.length} מתוך {adminNotifications.length} התראות
      </div>

    </div>
  );
}

export default AdminNotifications;
