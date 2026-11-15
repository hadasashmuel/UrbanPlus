
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../store/notifications/notificationsThunks";
import "./NotificationsBell.css";

function NotificationsBell() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const loading = useAppSelector(
    (state) => state.notifications.loading
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteNotification(id));
  };

  return (
    <div className="notification-bell-wrapper">
      <button
        className="notification-bell-button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="ההתראות שלי"
        aria-label="ההתראות שלי"
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-bell-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>ההתראות שלי</h3>

            <button
              className="notification-dropdown-close"
              onClick={() => setIsOpen(false)}
              aria-label="סגירה"
            >
              ×
            </button>
          </div>

          <div className="notification-dropdown-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-empty">
                טוען התראות...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span>🔔</span>
                <p>אין עדיין התראות להצגה</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`notification-card ${
                    !notification.isRead ? "unread" : ""
                  }`}
                >
                  <div className="notification-card-content">
                    <div className="notification-card-title">
                      <strong>
                        {notification.titleMainEvent || "התראה חדשה"}
                      </strong>

                      {!notification.isRead && (
                        <span className="notification-unread-dot" />
                      )}
                    </div>

                    <p>{notification.content}</p>

                    {notification.distanceFromEvent > 0 && (
                      <small>
                        מרחק מהאירוע:{" "}
                        {notification.distanceFromEvent.toFixed(2)} ק"מ
                      </small>
                    )}
                  </div>

                  <div className="notification-card-actions">
                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(notification.notificationId)
                        }
                      >
                        סמן כנקרא
                      </button>
                    )}

                    <button
                      className="notification-delete-button"
                      onClick={() =>
                        handleDelete(notification.notificationId)
                      }
                    >
                      מחיקה
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
