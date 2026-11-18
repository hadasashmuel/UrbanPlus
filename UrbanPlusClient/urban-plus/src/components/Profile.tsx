
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyProfile } from "../store/users/usersThunks";
import { fetchMyReports } from "../store/reports/reportsThunks";
import {
  fetchMainEvents,
  fetchSavedEvents,
  fetchMyVotes,
} from "../store/events/eventsThunks";
import "./Profile.css";

const API_BASE = "https://urbanpluspro.premiumasp.net";

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
    return report.imageList.filter((image) => !!image?.imageUrl);
  }

  if (report.imageList?.imageUrl) {
    return [report.imageList];
  }

  if (report.imageUrl) {
    return [{ imageUrl: report.imageUrl }];
  }

  return [];
};

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("he-IL");
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

  // אירועים שמורים והצבעות
  const mainEvents = useAppSelector(
    (state) => state.events.mainEvents
  );

  const savedEvents = useAppSelector(
    (state) => state.events.savedEvents
  );

  const votes = useAppSelector(
    (state) => state.events.votes
  );

  const loadingMainEvents = useAppSelector(
    (state) => state.events.loadingMainEvents
  );

  const loadingSavedEvents = useAppSelector(
    (state) => state.events.loadingSavedEvents
  );

  const loadingMyVotes = useAppSelector(
    (state) => state.events.loadingMyVotes
  );

  const userBadges = user?.userBadges ?? [];

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchMyReports());

    dispatch(fetchMainEvents());
    dispatch(fetchSavedEvents());
    dispatch(fetchMyVotes());
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

  // התאמת האירועים השמורים לפרטי האירועים
  const savedEventDetails = savedEvents
    .map((savedEvent) => {
      const event = mainEvents.find(
        (item) => item.mainEventsId === savedEvent.mainEventId
      );

      if (!event) return null;

      return {
        savedEvent,
        event,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // התאמת ההצבעות לפרטי האירועים
  const voteDetails = votes
    .map((vote) => {
      const event = mainEvents.find(
        (item) => item.mainEventsId === vote.mainEventId
      );

      if (!event) return null;

      return {
        vote,
        event,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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

            {user.roleCode === 1 && (
              <button
                className="profile-admin-button"
                onClick={() => navigate("/admin")}
              >
                ▦ לוח מנהל
              </button>
            )}
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

          <article className="profile-stat-card badges-stat">
            <div className="stat-icon">✧</div>
            <div>
              <span>התגים שלי</span>
              <strong>{userBadges.length}</strong>
              <small>הישגים שצברת בקהילה</small>
            </div>
          </article>

          <article className="profile-stat-card saved-events-stat">
            <div className="stat-icon">♡</div>
            <div>
              <span>אירועים שמורים</span>
              <strong>{savedEvents.length}</strong>
              <small>אירועים ששמרת</small>
            </div>
          </article>

          <article className="profile-stat-card votes-stat">
            <div className="stat-icon">☑</div>
            <div>
              <span>ההצבעות שלי</span>
              <strong>{votes.length}</strong>
              <small>הצבעות שביצעת</small>
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
                    {formatDate(badge.createdAt)}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* האירועים השמורים שלי */}
      <section className="my-saved-events-section">
        <div className="saved-events-heading">
          <div>
            <span className="profile-eyebrow">
              YOUR SAVED EVENTS
            </span>
            <h2>האירועים ששמרתי</h2>
            <p>כל האירועים שבחרת לשמור במקום אחד.</p>
          </div>

          <span className="saved-events-count">
            {savedEvents.length} אירועים
          </span>
        </div>

        {(loadingMainEvents || loadingSavedEvents) && (
          <p className="profile-message">
            טוען את האירועים השמורים...
          </p>
        )}

        {!loadingMainEvents &&
          !loadingSavedEvents &&
          savedEvents.length === 0 && (
            <div className="empty-saved-events">
              <div className="empty-saved-events-icon">♡</div>
              <h3>עדיין לא שמרת אירועים</h3>
              <p>
                אפשר לשמור אירועים מהמפה ולחזור אליהם כאן בכל זמן.
              </p>
            </div>
          )}

        {!loadingMainEvents &&
          !loadingSavedEvents &&
          savedEvents.length > 0 &&
          savedEventDetails.length === 0 && (
            <p className="profile-message">
              לא נמצאו פרטי האירועים השמורים.
            </p>
          )}

        {!loadingMainEvents &&
          !loadingSavedEvents &&
          savedEventDetails.length > 0 && (
            <div className="my-saved-events-list">
              {savedEventDetails.map(({ savedEvent, event }) => (
                <article
                  className="my-saved-event-card"
                  key={savedEvent.savedEventId}
                >
                  <div className="saved-event-card-top">
                    <span className="saved-event-category">
                      {event.categoryName}
                    </span>
                    <span className="saved-event-date">
                      נשמר בתאריך {formatDate(savedEvent.createdAt)}
                    </span>
                  </div>

                  <h3>{event.title}</h3>

                  <div className="saved-event-address">
                    <span>⌖</span>
                    {event.address || "לא צוין מיקום"}
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* ההצבעות שלי */}
      <section className="my-votes-section">
        <div className="votes-heading">
          <div>
            <span className="profile-eyebrow">
              YOUR VOTES
            </span>
            <h2>ההצבעות שלי</h2>
            <p>ההצבעות שביצעת על אירועים בקהילה.</p>
          </div>

          <span className="votes-count">
            {votes.length} הצבעות
          </span>
        </div>

        {(loadingMainEvents || loadingMyVotes) && (
          <p className="profile-message">
            טוען את ההצבעות...
          </p>
        )}

        {!loadingMainEvents &&
          !loadingMyVotes &&
          votes.length === 0 && (
            <div className="empty-votes">
              <div className="empty-votes-icon">☑</div>
              <h3>עדיין לא הצבעת על אירועים</h3>
              <p>
                ההצבעות שלך עוזרות לקהילה לאמת את המידע על האירועים.
              </p>
            </div>
          )}

        {!loadingMainEvents &&
          !loadingMyVotes &&
          votes.length > 0 &&
          voteDetails.length === 0 && (
            <p className="profile-message">
              לא נמצאו פרטי האירועים שעליהם הצבעת.
            </p>
          )}

        {!loadingMainEvents &&
          !loadingMyVotes &&
          voteDetails.length > 0 && (
            <div className="my-votes-list">
              {voteDetails.map(({ vote, event }) => (
                <article
                  className="my-vote-card"
                  key={vote.voteId}
                >
                  <div className="vote-card-top">
                    <span className="vote-category">
                      {event.categoryName}
                    </span>

                    <span className="vote-date">
                      {formatDate(vote.createdAt)}
                    </span>
                  </div>

                  <h3>{event.title}</h3>

                  <div className="vote-card-bottom">
                    <span className="vote-address">
                      <span>⌖</span>
                      {event.address || "לא צוין מיקום"}
                    </span>

                    <span
                      className={`vote-type ${
                        vote.typeVote === 0
                          ? "vote-exists"
                          : "vote-not-exists"
                      }`}
                    >
                      {vote.typeVote === 0
                        ? "👍 קיים"
                        : "👎 לא קיים"}
                    </span>
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
                        {formatDate(report.createdAt)}
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
                {formatDate(selectedReport.createdAt)}
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
