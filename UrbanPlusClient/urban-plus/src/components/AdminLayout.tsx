
import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearRealtimeNotification } from "../store/notifications/notificationsSlice";
import NotificationsBell from "./NotificationsBell";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.users.user);

  const realtimeNotification = useAppSelector(
    (state) => state.notifications.realtimeNotification
  );

  const unreadNotificationsCount = useAppSelector(
    (state) =>
      state.notifications.notifications.filter(
        (notification) => !notification.isRead
      ).length
  );

  useEffect(() => {
    if (!realtimeNotification) return;

    const timeout = window.setTimeout(() => {
      dispatch(clearRealtimeNotification());
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [realtimeNotification, dispatch]);

  const menuItems = [
    { path: "/admin", label: "סקירה כללית", icon: "▦", end: true },
    { path: "/admin/users", label: "ניהול משתמשים", icon: "👥" },
    { path: "/admin/events", label: "ניהול אירועים", icon: "📋" },
    { path: "/admin/reports", label: "ניהול דיווחים", icon: "⚑" },
    { path: "/admin/categories", label: "ניהול קטגוריות", icon: "▤" },
    { path: "/admin/badges", label: "תגי משתמשים", icon: "🏅" },
    { path: "/admin/notifications", label: "ניהול התראות", icon: "🔔" },
  ];

  return (
    <div className="admin-layout">
      {realtimeNotification && (
        <div className="admin-notification-popup">
          <button
            className="admin-notification-close"
            onClick={() => dispatch(clearRealtimeNotification())}
            aria-label="סגירת התראה"
          >
            ×
          </button>

          <div className="admin-notification-popup-icon">🔔</div>

          <div className="admin-notification-popup-content">
            <strong>התראה חדשה</strong>
            <p>{realtimeNotification.content}</p>
            {realtimeNotification.titleMainEvent && (
              <small>{realtimeNotification.titleMainEvent}</small>
            )}
          </div>
        </div>
      )}

      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand-icon">U+</span>
          <div>
            <h1>URBAN+</h1>
            <span>מערכת ניהול</span>
          </div>
        </div>

        <div className="admin-topbar-left">
          <NotificationsBell />

          <div className="admin-welcome">
            <span>שלום,</span>
            <strong>
              {currentUser
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : "מנהל המערכת"}
            </strong>
          </div>

          <button
            className="admin-exit-button"
            onClick={() => navigate("/")}
          >
            חזרה למערכת ←
          </button>
        </div>
      </header>

      <div className="admin-layout-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-heading">
            <span>לוח בקרה</span>
            <small>ניהול המערכת</small>
          </div>

          <nav className="admin-navigation">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.label}</span>

                {item.path === "/admin/notifications" &&
                  unreadNotificationsCount > 0 && (
                    <span className="admin-notification-count">
                      {unreadNotificationsCount}
                    </span>
                  )}

                <span className="admin-nav-arrow">‹</span>
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <span>URBAN+ ADMIN</span>
            <small>ניהול ובקרה</small>
          </div>
        </aside>

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
