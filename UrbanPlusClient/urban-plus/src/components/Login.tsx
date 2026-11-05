import { useState,useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  document.title = "התחברות | URBAN+";
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // כאן נחבר בהמשך את ההתחברות לשרת
    console.log({ email, password });

    // מעבר למפה — כרגע לצורך בדיקה בלבד
    navigate("/map");
  }

  return (
    <div className="auth-overlay">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">URBAN+</div>

        <h2>התחברות</h2>

        <p className="auth-subtitle">
          התחברי כדי להמשיך ל-Urban+
        </p>

        <FormField
          label="אימייל"
          type="email"
          value={email}
          onChange={setEmail}
        />

        <FormField
          label="סיסמה"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <a
          className="auth-link forgot-link"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          שכחת סיסמה?
        </a>

        <button type="submit" className="auth-submit">
          אישור ההתחברות
        </button>

        <p className="auth-footer">
          עדיין אין לך חשבון?{" "}
          <a href="/register">הרשמה</a>
        </p>

        <button
          type="button"
          className="auth-back"
          onClick={() => navigate("/")}
        >
          חזרה לעמוד הראשי
        </button>
      </form>
    </div>
  );
}

export default Login;
