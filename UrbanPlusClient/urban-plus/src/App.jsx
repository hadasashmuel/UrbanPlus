import React, { useState } from 'react';
import './App.css';
import Map from './map'; 
import Login from './Login/login'; // ייבוא נכון של קובץ ההתחברות לפי הנתיב שלך

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="app-container">
      {/* הצגת המפה ברקע */}
      <Map /> 

      {/* כפתור פרופיל/התחברות צף בפינה העליונה */}
      <div className="top-nav-overlay">
        <button 
          className="profile-btn" 
          onClick={() => setIsLoginOpen(true)}
          title="התחברות / פרופיל"
        >
          {/* אייקון פרופיל בסגנון מודרני (SVG) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
          <span className="profile-text">התחבר</span>
        </button>
      </div>

      {/* חלון התחברות קופץ (Modal) שמוצג כשהמשתמש לוחץ על הכפתור */}
      {isLoginOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsLoginOpen(false)}>✕</button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;