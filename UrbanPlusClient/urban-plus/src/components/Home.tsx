
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import MapScreen from "./Map";
import AddReport from "./AddReport";
import AIChat from "./AIChat";
import NotificationsBell from "./NotificationsBell";
import { useAppSelector } from "../store/hooks";
import "./Home.css";

function HomeScreen() {
  const [isReportOpen, setIsReportOpen] = useState(false);

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
              <NotificationsBell />

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

      <Outlet />

      {isReportOpen && (
        <AddReport onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
}

export default HomeScreen;
