
import { useState } from "react";
import MapScreen from "./Map";
import "./Home.css";

function HomeScreen() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="screen map">
      {/* המפה כרקע מלא */}
      <div className="home-map-background">
        <MapScreen />
      </div>

      {/* סרגל עליון שקוף */}
      <header className="topbar">
        <h1 className="logo">
          <span>+</span>URBAN
        </h1>

        <div className="topbar-actions">
          <button
            className="auth-button register-button"
            onClick={() => (window.location.href = "/register")}
          >
            הרשמה
          </button>

          <button
            className="auth-button login-button"
            onClick={() => (window.location.href = "/login")}
          >
            התחברות
          </button>
        </div>
      </header>

      {/* כפתור דיווח */}
      <button
        className="floating-report"
        onClick={() => (window.location.href = "/report")}
      >
        <span>＋</span>
        דיווח על מפגע
      </button>
      <button
        onClick={() => (window.location.href = "/update-user")}
      >
        עדכון פרטי משתמש
      </button>
      {/* כפתור צ'אט */}
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
