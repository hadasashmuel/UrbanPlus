import React, { useState } from "react";
import "./Login.css";
import urbanLogo from "./UrbanPlusLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    // כאן בהמשך נחבר את ההתחברות לשרת
  };

  return (
    <div className="login-page" dir="rtl">

      <div className="login-container">

        <h1>התחבר</h1>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label htmlFor="email">אימייל</label>

            <input
              id="email"
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">סיסמא</label>

            <input
              id="password"
              type="password"
              placeholder="סיסמא"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="#" className="forgot-password">
            שכחת סיסמא?
          </a>

          <button type="submit" className="login-button">
            התחברות
          </button>

        </form>

        <a href="#" className="register-link">
          יצירת משתמש
        </a>

        <div className="logo-container">
          <img
            src={urbanLogo}
            alt="Urban+"
            className="urban-logo"
          />
        </div>

      </div>

    </div>
  );
}

export default Login;