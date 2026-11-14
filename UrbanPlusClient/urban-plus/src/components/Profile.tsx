
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyProfile } from "../store/users/usersThunks";
import { fetchMyReports } from "../store/reports/reportsThunks";
import "./Profile.css";

const API_BASE = "https://localhost:7019";

interface ReportImage {
  reportImageId?: number;
  imageUrl: string;
}

interface Report {
  reportId: number;
  title: string;
  description: string;
  categoryName: string;
  createdAt: string;
  inputAddress: string;
  imageList?: ReportImage[] | ReportImage | null;
  imageUrl?: string;
}

const getImageSrc = (imageUrl: string): string => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  return `${API_BASE}/images/${imageUrl.replace(/^\/+/, "")}`;
};

const getReportImages = (report: Report): ReportImage[] => {
  if (Array.isArray(report.imageList)) {
    return report.imageList.filter(
      (image) => !!image?.imageUrl
    );
  }

  if (report.imageList?.imageUrl) {
    return [report.imageList];
  }

  if (report.imageUrl) {
    return [{ imageUrl: report.imageUrl }];
  }

  return [];
};

function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedReport, setSelectedReport] =
    useState<Report | null>(null);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const user = useAppSelector((state) => state.users.user);
  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  const myReports: Report[] =
    useAppSelector((state) => state.reports.myReports) || [];

  const reportsLoading = useAppSelector(
    (state) => state.reports.loading
  );

  const reportsError = useAppSelector(
    (state) => state.reports.error
  );

  // התגים שהמשתמש צבר
  const userBadges = user?.userBadges ?? [];

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchMyReports());
  }, [dispatch]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          setSelectedReport(null);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedImage]);

  const closeReportModal = () => {
    setSelectedReport(null);
    setSelectedImage(null);
  };

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
          <span className="profile-eyebrow">
            URBAN+ PERSONAL SPACE
          </span>
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
                src={getImageSrc(user.profilePicture)}
                alt="תמונת פרופיל"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              "👤"
            )}
          </div>

          <div className="profile-user-info">
            <span className="profile-label">החשבון שלי</span>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
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

      {/* התגים שלי */}
      <section className="my-badges-section">
        <div className="badges-heading">
          <div>
            <span className="profile-eyebrow">
              YOUR ACHIEVEMENTS
            </span>
            <h2>התגים שלי</h2>
            <p>
              כל ההישגים שצברת בזכות התרומה שלך לקהילה.
            </p>
          </div>

          <span className="badges-count">
            {userBadges.length} תגים
          </span>
        </div>

        {userBadges.length === 0 ? (
          <div className="empty-badges">
            <div className="empty-badges-icon">✧</div>
            <h3>המסע שלך רק מתחיל!</h3>
            <p>
              דווחו על מפגעים, הצביעו ושמרו אירועים כדי לצבור
              הישגים ולקבל תגים מיוחדים.
            </p>
          </div>
        ) : (
          <div className="my-badges-list">
            {userBadges.map((badge) => (
              <article
                className="my-badge-card"
                key={badge.badgeId}
              >
                <div className="badge-icon-wrapper">
                  {badge.icon ? (
                    <img
                      src={getImageSrc(badge.icon)}
                      alt={badge.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>✦</span>
                  )}
                </div>

                <div className="badge-info">
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                  <small>
                    <span>✓</span>
                    התקבל בתאריך{" "}
                    {new Date(
                      badge.createdAt
                    ).toLocaleDateString("he-IL")}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* הדיווחים שלי */}
      <section className="my-reports-section">
        <div className="reports-heading">
          <div>
            <span className="profile-eyebrow">
              YOUR CONTRIBUTION
            </span>
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

        {!reportsLoading &&
          !reportsError &&
          myReports.length === 0 && (
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

        {!reportsLoading &&
          !reportsError &&
          myReports.length > 0 && (
            <div className="my-reports-list">
              {myReports.map((report) => {
                const images = getReportImages(report);

                return (
                  <article
                    className="my-report-card clickable-report"
                    key={report.reportId}
                    onClick={() => setSelectedReport(report)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        setSelectedReport(report);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`צפייה בפרטי הדיווח ${report.title}`}
                  >
                    <div className="report-card-top">
                      <span className="report-category">
                        {report.categoryName}
                      </span>

                      <span className="report-date">
                        {new Date(report.createdAt).toLocaleDateString(
                          "he-IL"
                        )}
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

                    {images.length > 0 && (
                      <div className="my-report-images">
                        {images.slice(0, 3).map((image, index) => (
                          <img
                            key={
                              image.reportImageId ??
                              `${report.reportId}-${index}`
                            }
                            src={getImageSrc(image.imageUrl)}
                            alt="תמונה מהדיווח"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="report-card-more">
                      צפייה בפרטי הדיווח
                      <span>←</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>

      {selectedReport && (
        <div
          className="report-details-overlay"
          onClick={closeReportModal}
        >
          <div
            className="report-details-modal"
            dir="rtl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="report-details-close"
              onClick={closeReportModal}
              aria-label="סגירת פרטי הדיווח"
            >
              ×
            </button>

            <div className="report-details-header">
              <span className="report-details-eyebrow">
                URBAN+ COMMUNITY REPORT
              </span>

              <span className="report-details-category">
                {selectedReport.categoryName}
              </span>

              <h2>{selectedReport.title}</h2>

              <span className="report-details-date">
                <span>◷</span>
                {new Date(
                  selectedReport.createdAt
                ).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className="report-details-content">
              <div className="report-details-section">
                <h3>תיאור הדיווח</h3>
                <p className="report-details-description">
                  {selectedReport.description ||
                    "לא נוסף תיאור לדיווח זה."}
                </p>
              </div>

              <div className="report-details-section">
                <h3>מיקום הדיווח</h3>
                <div className="report-details-location">
                  <span>⌖</span>
                  {selectedReport.inputAddress || "לא צוין מיקום"}
                </div>
              </div>

              {getReportImages(selectedReport).length > 0 ? (
                <div className="report-details-section">
                  <div className="report-details-images-heading">
                    <h3>תמונות מהשטח</h3>
                    <span>
                      {getReportImages(selectedReport).length} תמונות
                    </span>
                  </div>

                  <div className="report-details-gallery">
                    {getReportImages(selectedReport).map(
                      (image, index) => (
                        <button
                          className="report-details-image-button"
                          key={
                            image.reportImageId ??
                            `${selectedReport.reportId}-${index}`
                          }
                          onClick={() =>
                            setSelectedImage(
                              getImageSrc(image.imageUrl)
                            )
                          }
                          aria-label="הצגת התמונה בגודל מלא"
                        >
                          <img
                            src={getImageSrc(image.imageUrl)}
                            alt="תמונה מהדיווח"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span>הגדלה ↗</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="report-no-images">
                  <span>▧</span>
                  <p>לא צורפו תמונות לדיווח הזה</p>
                </div>
              )}
            </div>

            <div className="report-details-footer">
              <span>תודה על התרומה שלך לקהילה 💚</span>
              <button onClick={closeReportModal}>סגירה</button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="report-image-lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="report-image-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="סגירת התמונה"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="תמונה מוגדלת מהדיווח"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

export default Profile;
