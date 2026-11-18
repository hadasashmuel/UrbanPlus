
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import "./ShortUserProfile.css";

interface ShowBadge {
  badgeId: number;
  badgeName: string;
  description: string;
  iconUrl: string;
}

interface ShowSavedEvent {
  savedEventId: number;
  userId: number;
  mainEventId: number;
  createdAt: string;
}

interface ShortProfileUser {
  firstName: string;
  lastName: string;
  scoreReliability: number;
  createdAt: string;
  profilePicture?: string | null;
  badges: ShowBadge[];
  savedEvents: ShowSavedEvent[];
}

interface ShortUserProfileProps {
  userId: number;
  onClose: () => void;
}

const API_URL = "https://urbanpluspro.premiumasp.net/api/User";

function ShortUserProfile({
  userId,
  onClose,
}: ShortUserProfileProps) {
  const token = useAppSelector((state) => state.users.token);

  const [profile, setProfile] = useState<ShortProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/${userId}/short`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });

        if (!response.ok) {
          throw new Error("טעינת הפרופיל נכשלה");
        }

        const data: ShortProfileUser = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("שגיאה בטעינת פרופיל המשתמש:", err);
        setError("לא ניתן לטעון את פרטי המשתמש כרגע");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  return (
    <div className="short-profile-overlay" onClick={onClose}>
      <div
        className="short-profile-modal"
        onClick={(event) => event.stopPropagation()}
        dir="rtl"
      >
        <button
          className="short-profile-close"
          onClick={onClose}
          type="button"
          aria-label="סגירה"
        >
          ×
        </button>

        {loading && (
          <p className="short-profile-info">טוען פרופיל...</p>
        )}

        {error && (
          <p className="short-profile-error">{error}</p>
        )}

        {profile && !loading && (
          <>
            <div className="short-profile-header">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="תמונת פרופיל"
                  className="short-profile-image"
                />
              ) : (
                <div className="short-profile-placeholder">
                  {profile.firstName?.charAt(0)}
                </div>
              )}

              <h3>
                {profile.firstName} {profile.lastName}
              </h3>

              <p>
                חבר/ה בקהילה מאז{" "}
                {new Date(profile.createdAt).toLocaleDateString("he-IL")}
              </p>
            </div>

            <div className="short-profile-reliability">
              <span>ציון אמינות</span>
              <strong>{profile.scoreReliability}</strong>
            </div>

            <div className="short-profile-section">
              <h4>🏅 תגי הישגים</h4>

              {profile.badges?.length > 0 ? (
                <div className="short-profile-badges">
                  {profile.badges.map((badge) => (
                    <div
                      className="short-profile-badge"
                      key={badge.badgeId}
                      title={badge.description}
                    >
                      {badge.iconUrl && (
                        <img src={badge.iconUrl} alt="" />
                      )}
                      <span>{badge.badgeName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>עדיין אין תגי הישגים</p>
              )}
            </div>

            <div className="short-profile-section">
              <h4>📌 אירועים שמורים</h4>

              <p>
                {profile.savedEvents?.length
                  ? `שמורים ${profile.savedEvents.length} אירועים`
                  : "אין אירועים שמורים"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShortUserProfile;
