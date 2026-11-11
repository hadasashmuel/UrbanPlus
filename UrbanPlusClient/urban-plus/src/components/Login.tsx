
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginUser,
  googleLoginUser,
} from "../store/users/usersThunks";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  useEffect(() => {
    document.title = "התחברות | URBAN+";
  }, []);

  // התחברות רגילה
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const result = await dispatch(
        loginUser({
          email,
          password,
          authProvider: 2,
        })
      ).unwrap();

      console.log("תשובת התחברות מהשרת:", result);
      console.log("הטוקן שהתקבל:", result.token);

      navigate("/map");
    } catch {
      // השגיאה מוצגת מתוך Redux
    }
  }

  // התחברות באמצעות Google
  async function handleGoogleSuccess(credential: string) {
    try {
      const result = await dispatch(
        googleLoginUser(credential)
      ).unwrap();

      console.log("תשובת התחברות Google:", result);
      console.log("הטוקן שהתקבל:", result.token);

      navigate("/map");
    } catch {
      // השגיאה מוצגת מתוך Redux
    }
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

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? "מתחבר..." : "אישור ההתחברות"}
        </button>

        {/* הפרדה בין סוגי ההתחברות */}
        <div className="auth-divider">
          <span>או התחברי באמצעות</span>
        </div>

        {/* התחברות Google */}
        <div className="google-login">
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) {
                handleGoogleSuccess(response.credential);
              }
            }}
            onError={() => {
              console.error("Google login failed");
            }}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            logo_alignment="center"
            width="300"
            
          />
        </div>

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
