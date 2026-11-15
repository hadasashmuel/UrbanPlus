
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { fetchCategories } from "../store/categories/categoriesThunks";
import { fetchBadges } from "../store/badges/badgesThunks";
import { fetchMyNotifications } from "../store/notifications/notificationsThunks";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.users.token);

  const usersCount = useAppSelector(
    (state) => state.users.adminUsers.length
  );

  const eventsCount = useAppSelector(
    (state) => state.events.mainEvents.length
  );

  const categoriesCount = useAppSelector(
    (state) => state.categories.categories.length
  );

  const badgesCount = useAppSelector(
    (state) => state.badges.badges.length
  );

  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
      dispatch(fetchBadges(token));
      dispatch(fetchMyNotifications());
    }
  }, [dispatch, token]);

  const sections = [
    {
      title: "ניהול משתמשים",
      description: "צפייה במשתמשי המערכת וניהול החשבונות",
      icon: "👥",
      path: "/admin/users",
    },
    {
      title: "ניהול אירועים",
      description: "צפייה באירועים, פרטים ומחיקת אירועים",
      icon: "📋",
      path: "/admin/events",
    },
    {
      title: "ניהול דיווחים",
      description: "מעקב וטיפול בדיווחים שהתקבלו",
      icon: "⚑",
      path: "/admin/reports",
    },
    {
      title: "ניהול קטגוריות",
      description: "הוספה, עריכה ומחיקת קטגוריות",
      icon: "▤",
      path: "/admin/categories",
    },
    {
      title: "תגי משתמשים",
      description: "ניהול תגי משתמשים והענקתם",
      icon: "🏅",
      path: "/admin/badges",
    },
    {
      title: "ניהול התראות",
      description: "שליחת התראות למשתמשים במערכת",
      icon: "🔔",
      path: "/admin/notifications",
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <h1>סקירה כללית</h1>
          <p>ברוכה הבאה ללוח הניהול של URBAN+</p>
        </div>
      </header>

      <section className="admin-dashboard-stats">
        <div className="admin-dashboard-stat">
          <div className="admin-dashboard-stat-icon">👥</div>
          <div>
            <span>משתמשים שנטענו</span>
            <strong>{usersCount}</strong>
          </div>
        </div>

        <div className="admin-dashboard-stat">
          <div className="admin-dashboard-stat-icon">📋</div>
          <div>
            <span>אירועים שנטענו</span>
            <strong>{eventsCount}</strong>
          </div>
        </div>

        <div className="admin-dashboard-stat">
          <div className="admin-dashboard-stat-icon">▤</div>
          <div>
            <span>קטגוריות במערכת</span>
            <strong>{categoriesCount}</strong>
          </div>
        </div>

        <div className="admin-dashboard-stat">
          <div className="admin-dashboard-stat-icon">🏅</div>
          <div>
            <span>תגים במערכת</span>
            <strong>{badgesCount}</strong>
          </div>
        </div>

        <div className="admin-dashboard-stat">
          <div className="admin-dashboard-stat-icon">🔔</div>
          <div>
            <span>התראות שלא נקראו</span>
            <strong>{unreadNotificationsCount}</strong>
          </div>
        </div>
      </section>

      <section className="admin-dashboard-sections">
        <div className="admin-dashboard-section-heading">
          <h2>אזורי ניהול</h2>
          <p>בחרי את האזור שבו תרצי לעבוד</p>
        </div>

        <div className="admin-dashboard-grid">
          {sections.map((section) => (
            <button
              key={section.path}
              className="admin-dashboard-card"
              onClick={() => navigate(section.path)}
            >
              <div className="admin-dashboard-card-icon">
                {section.icon}
              </div>

              <h3>{section.title}</h3>
              <p>{section.description}</p>

              <span className="admin-dashboard-card-link">
                כניסה לניהול ←
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
