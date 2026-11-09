
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUser } from "../store/users/usersThunks";
import "./UpdateUser.css";

function UpdateUser() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.users.user);
  const loading = useAppSelector((state) => state.users.loading);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setMessage("יש למלא שם פרטי ושם משפחה");
      return;
    }

    try {
      await dispatch(
        updateUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        })
      ).unwrap();

      navigate("/profile");
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : "עדכון הפרטים נכשל, נסי שוב"
      );
    }
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

          {message && (
            <p
              className="update-user-message error"
              role="alert"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="update-user-button"
            disabled={loading}
          >
            {loading ? "מעדכן..." : "עדכון פרטים"}
          </button>
        </form>

        <button
          type="button"
          className="update-user-back"
          onClick={() => navigate("/profile")}
        >
          חזרה לפרופיל
        </button>
      </section>
    </main>
  );
}

export default UpdateUser;
