import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormField from "./FormField";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/users/usersThunks";
import "./Register.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector((state) => state.users.loading);
  const serverError = useAppSelector((state) => state.users.error);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("יש למלא את כל השדות");
      return;
    }

    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    try {
      await dispatch(
        registerUser({
          firstName,
          lastName,
          email,
          password,
          authProvider: 2,
          profilePicture,
        })
      ).unwrap();

      navigate("/login", { state: { registered: true } });
    } catch {
      // שגיאת השרת מוצגת למשתמש
    }
  }

  return (
    <div className="register-overlay">
      <form className="register-card" onSubmit={handleSubmit}>
        <div className="register-logo">URBAN+</div>

        <h1>הצטרפי אלינו!</h1>

        <p className="register-subtitle">
          צרי חשבון והצטרפי לקהילה שעוזרת לשמור
          על המרחב הציבורי
        </p>

        <FormField
          label="שם פרטי"
          type="text"
          value={firstName}
          onChange={setFirstName}
        />

        <FormField
          label="שם משפחה"
          type="text"
          value={lastName}
          onChange={setLastName}
        />

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

        <FormField
          label="אישור סיסמה"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <div className="register-picture-field">
          <label htmlFor="profilePicture">תמונת פרופיל (לא חובה)</label>

          <input
            id="profilePicture"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) =>
              setProfilePicture(e.target.files?.[0] ?? null)
            }
          />

          {profilePicture && (
            <p>נבחרה תמונה: {profilePicture.name}</p>
          )}
        </div>

        {(error || serverError) && (
          <p className="register-error" role="alert">
            {error || serverError}
          </p>
        )}

        <button
          type="submit"
          className="register-submit"
          disabled={loading}
        >
          {loading ? "נרשמת..." : "אישור ההרשמה"}
        </button>

        <p className="register-footer">
          כבר יש לך חשבון? <Link to="/login">התחברות</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
