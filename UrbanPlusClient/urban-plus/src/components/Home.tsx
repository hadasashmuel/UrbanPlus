
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import MapScreen from "./Map";
import AddReport from "./AddReport";
import AIChat from "./AIChat";
import { useAppSelector } from "../store/hooks";
import "./Home.css";

function HomeScreen() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const token = useAppSelector((state) => state.users.token);
  const isLoggedIn = !!token;

  return (
    <div className="screen map">
      <div className="home-map-background">
        <MapScreen />
      </div>

      <header className="topbar">
        <h1 className="logo">
          <span>+</span>URBAN
        </h1>

        <div className="topbar-actions">
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button
                className="auth-button register-button"
                onClick={() => navigate("/register")}
              >
                הרשמה
              </button>

              <button
                className="auth-button login-button"
                onClick={() => navigate("/login")}
              >
                התחברות
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <div className="notification-wrapper">
                <button
                  className="notification-button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="ההתראות שלי"
                  aria-label="ההתראות שלי"
                >
                  🔔
                </button>

                {showNotifications && (
                  <div className="notifications-panel">
                    <div className="notifications-header">
                      <h3>ההתראות שלי</h3>

                      <button
                        onClick={() => setShowNotifications(false)}
                        aria-label="סגירה"
                      >
                        ×
                      </button>
                    </div>

                    <div className="notifications-empty">
                      <span>🔔</span>
                      <p>אין עדיין התראות להצגה</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="user-icon-button"
                onClick={() => navigate("/profile")}
                title="הפרופיל שלי"
              >
                👤
              </button>
            </div>
          )}

          <button
            type="button"
            className="active-events-nav-button"
            onClick={() => navigate("/active-events")}
          >
            <span>☰</span>
            לכל האירועים הפעילים
          </button>
        </div>
      </header>

      {isLoggedIn && (
        <button
          className="floating-report"
          onClick={() => setIsReportOpen(true)}
        >
          <span className="report-plus">＋</span>
          <span>דיווח על מפגע</span>
        </button>
      )}

      <AIChat />

      {/* חלונות התחברות והרשמה צפים מעל המפה */}
      <Outlet />

      {isReportOpen && (
        <AddReport onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
}

export default HomeScreen;
