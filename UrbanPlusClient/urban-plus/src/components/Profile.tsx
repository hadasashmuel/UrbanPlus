
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyProfile } from "../store/users/usersThunks";
import { fetchMyReports } from "../store/reports/reportsThunks";
import "./Profile.css";

function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.users.user);
  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  const myReports = useAppSelector((state) => state.reports.myReports);
  const reportsLoading = useAppSelector((state) => state.reports.loading);
  const reportsError = useAppSelector((state) => state.reports.error);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchMyReports());
  }, [dispatch]);

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

      <header className="profile-welcome">
        <div>
          <span className="profile-eyebrow">URBAN+ PERSONAL SPACE</span>
          <h1>שלום, {user.firstName} 👋</h1>
          <p>כיף לראות אותך כאן. הנה הפעילות שלך בקהילה.</p>
        </div>

        <button
          className="profile-home-button"
          onClick={() => navigate("/")}
        >
          <span>⌂</span>
          חזרה למפה
        </button>
      </header>

      <section className="profile-dashboard">

        <div className="profile-card">
          <div className="profile-avatar">
            {user.profilePicture ? (
              <img
                src={`https://localhost:7019/images/${user.profilePicture}`}
                alt="תמונת פרופיל"
              />
            ) : (
              "👤"
            )}
          </div>

          <div className="profile-user-info">
            <span className="profile-label">החשבון שלי</span>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>

          <div className="profile-user-actions">
            <button
              className="profile-edit-button"
              onClick={() => navigate("/update-user")}
            >
              ✎ עדכון פרטים
            </button>
          </div>
        </div>

        <div className="profile-stats">

          <article className="profile-stat-card reliability-stat">
            <div className="stat-icon">✦</div>
            <div>
              <span>ניקוד אמינות</span>
              <strong>{user.scoreReliability}</strong>
              <small>הניקוד שלך בקהילה</small>
            </div>
          </article>

          <article className="profile-stat-card reports-stat">
            <div className="stat-icon">◎</div>
            <div>
              <span>הדיווחים שלי</span>
              <strong>{myReports.length}</strong>
              <small>דיווחים ששלחת למערכת</small>
            </div>
          </article>

        </div>
      </section>

      <section className="my-reports-section">

        <div className="reports-heading">
          <div>
            <span className="profile-eyebrow">YOUR CONTRIBUTION</span>
            <h2>הדיווחים שלי</h2>
            <p>כל הדיווחים שיצרת במקום אחד.</p>
          </div>

          <span className="reports-count">
            {myReports.length} דיווחים
          </span>
        </div>

        {reportsLoading && (
          <p className="profile-message">טוען את הדיווחים...</p>
        )}

        {reportsError && (
          <p className="profile-message">{reportsError}</p>
        )}

        {!reportsLoading && !reportsError && myReports.length === 0 && (
          <div className="empty-reports">
            <div className="empty-reports-icon">✧</div>
            <h3>עוד אין כאן דיווחים</h3>
            <p>
              נתקלת במפגע בסביבה? הדיווח שלך יכול לעזור לשפר את העיר.
            </p>
            <button onClick={() => navigate("/")}>
              מעבר למפה ודיווח ראשון
            </button>
          </div>
        )}

        {!reportsLoading && !reportsError && myReports.length > 0 && (
          <div className="my-reports-list">
            {myReports.map((report) => (
              <article className="my-report-card" key={report.reportId}>

                <div className="report-card-top">
                  <span className="report-category">
                    {report.categoryName}
                  </span>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString("he-IL")}
                  </span>
                </div>

                <h3>{report.title}</h3>

                <p className="report-description">
                  {report.description}
                </p>

                <div className="report-address">
                  <span>⌖</span>
                  {report.inputAddress}
                </div>

                {report.imageList && report.imageList.length > 0 && (
                  <div className="my-report-images">
                    {report.imageList.map((image) => (
                      <img
                        key={image.reportImageId}
                        src={image.imageUrl}
                        alt="תמונה מהדיווח"
                      />
                    ))}
                  </div>
                )}

              </article>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}

export default Profile;
