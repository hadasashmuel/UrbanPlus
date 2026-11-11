import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapScreen from "./Map";
import { useAppSelector } from "../store/hooks";
import "./Home.css";

function HomeScreen() {
  const [showChat, setShowChat] = useState(false);
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
            <button
              className="user-icon-button"
              onClick={() => navigate("/profile")}
              title="הפרופיל שלי"
            >
              👤
            </button>
          )}
        </div>
      </header>

      <button
        className="floating-report"
        onClick={() => navigate("/report")}
      >
        <span>＋</span>
        דיווח על מפגע
      </button>

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
    </div>
  );
}

export default HomeScreen;