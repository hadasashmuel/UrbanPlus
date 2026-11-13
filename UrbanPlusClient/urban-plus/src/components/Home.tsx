
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapScreen from "./Map";
import AddReport from "./AddReport";
import { useAppSelector } from "../store/hooks";
import "./Home.css";

function HomeScreen() {
  const [showChat, setShowChat] = useState(false);
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
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      {isLoggedIn && (
        <button
          className="floating-report"
          onClick={() => setIsReportOpen(true)}
        >
          <span>＋</span>
          דיווח על מפגע
        </button>
      )}

      <button onClick={() => navigate("/update-user")}>
        עדכון פרטי משתמש
      </button>

      <button
        className="chat-float-button"
        onClick={() => setShowChat(!showChat)}
      >
        <span>☏</span>
        צ'אט עם Urban+
      </button>

      {showChat && (
        <div className="chat-floating-panel">
          <button
            className="chat-close"
            onClick={() => setShowChat(false)}
            aria-label="סגירת צ'אט"
          >
            ×
          </button>
        </div>
      )}

      {isReportOpen && (
        <AddReport onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
}

export default HomeScreen;
