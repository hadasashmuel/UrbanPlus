import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyProfile } from "../store/users/usersThunks";
import "./Profile.css";

function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.users.user);
  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);
console.log("PROFILE USER:", user);
console.log("PROFILE ERROR:", error);
console.log("PROFILE LOADING:", loading);

  if (loading && !user) {
    return <p className="profile-message">טוען את הפרופיל...</p>;
  }

  if (error && !user) {
    return (
      <main className="profile-page" dir="rtl">
        <p className="profile-message">{error}</p>
        <button onClick={() => navigate("/login")}>
          מעבר להתחברות
        </button>
      </main>
    );
  }

  if (!user) {
    return <p className="profile-message">לא נמצאו פרטי משתמש</p>;
  }

  return (
    <main className="profile-page" dir="rtl">
      <section className="profile-card">
        <div className="profile-avatar">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="תמונת פרופיל"
            />
          ) : (
            "👤"
          )}
        </div>

        <h1>הפרופיל שלי</h1>

        <div className="profile-details">
          <p>
            <strong>שם פרטי:</strong> {user.firstName}
          </p>

          <p>
            <strong>שם משפחה:</strong> {user.lastName}
          </p>

          <p>
            <strong>אימייל:</strong> {user.email}
          </p>

          <p>
            <strong>ניקוד אמינות:</strong> {user.scoreReliability}
          </p>
        </div>

        <button
          className="profile-edit-button"
          onClick={() => navigate("/update-user")}
        >
          עדכון פרטים
        </button>

        <button
          className="profile-back-button"
          onClick={() => navigate("/")}
        >
          חזרה לעמוד הראשי
        </button>
      </section>
    </main>
  );
}

export default Profile;