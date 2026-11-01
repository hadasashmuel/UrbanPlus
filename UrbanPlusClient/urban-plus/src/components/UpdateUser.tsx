import { useState, type FormEvent } from "react";
import "./UpdateUser.css";

function UpdateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setMessage("יש למלא שם פרטי ושם משפחה");
      return;
    }

    // כאן נחבר בהמשך את עדכון הפרטים לשרת.
    setMessage("הפרטים הוזנו בהצלחה!");
  };

  return (
    <main className="update-user-page" dir="rtl">
      <section className="update-user-card">
        <div className="update-user-icon">👤</div>

        <h1>עדכון פרטי משתמש</h1>
        <p className="update-user-subtitle">
          כאן אפשר לעדכן את הפרטים האישיים שלך
        </p>

        <form onSubmit={handleUpdate}>
          <div className="update-user-field">
            <label htmlFor="firstName">שם פרטי</label>
            <input
              id="firstName"
              type="text"
              placeholder="הזיני שם פרטי"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>

          <div className="update-user-field">
            <label htmlFor="lastName">שם משפחה</label>
            <input
              id="lastName"
              type="text"
              placeholder="הזיני שם משפחה"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="update-user-forgot"
            onClick={() => {
              window.location.href = "/forgot-password";
            }}
          >
            שכחת סיסמה?
          </button>

          {message && (
            <p
              className={`update-user-message ${
                message.includes("בהצלחה") ? "success" : "error"
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="update-user-button">
            עדכון פרטים
          </button>
        </form>

        <button
          type="button"
          className="update-user-back"
          onClick={() => window.history.back()}
        >
          חזרה
        </button>
      </section>
    </main>
  );
}

export default UpdateUser;