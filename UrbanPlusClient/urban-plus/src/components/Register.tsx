
import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "./FormField";
import "./Register.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    console.log({
      firstName,
      lastName,
      email,
      password,
    });

    // בהמשך נחבר את ההרשמה לשרת
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
          value={firstName}
          onChange={setFirstName}
        />

        <FormField
          label="שם משפחה"
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

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="register-submit">
          אישור ההרשמה
        </button>

        <p className="register-footer">
          כבר יש לך חשבון?
          {" "}
          <a href="/login">התחברות</a>
        </p>
      </form>
    </div>
  );
}

export default Register;