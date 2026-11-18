
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCategories } from "../store/categories/categoriesThunks";
import { createReport } from "../store/reports/reportsThunks";
import "./AddReport.css";

interface AddReportProps {
  onClose: () => void;
}

function AddReport({ onClose }: AddReportProps) {
  const dispatch = useAppDispatch();

  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  const { loading, error } = useAppSelector(
    (state) => state.reports
  );

  const {
    latitude: savedLatitude,
    longitude: savedLongitude,
    isLocationReady,
  } = useAppSelector((state) => state.location);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationAction, setLocationAction] = useState<
    "saved" | "address" | null
  >(null);
  const [locationError, setLocationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const addressTouched = useRef(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // קבלת מיקום שמור מ-Redux והמרתו לכתובת
  useEffect(() => {
    if (
      !isLocationReady ||
      savedLatitude === null ||
      savedLongitude === null
    ) {
      return;
    }

    let active = true;

    setLatitude(savedLatitude);
    setLongitude(savedLongitude);
    setLocationLoading(true);
    setLocationAction("saved");
    setLocationError("");

    const getAddressFromCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${savedLatitude}&lon=${savedLongitude}&accept-language=he`
        );

        if (!response.ok) {
          throw new Error("לא ניתן לקבל כתובת");
        }

        const data = await response.json();
        const address = data.address;

        const street =
          address?.road ||
          address?.pedestrian ||
          address?.footway ||
          "";

        const houseNumber = address?.house_number || "";

        const city =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          "";

        const fullAddress = [
          street && `${street} ${houseNumber}`.trim(),
          city,
        ]
          .filter(Boolean)
          .join(", ");

        if (!active) return;

        if (!addressTouched.current) {
          if (fullAddress) {
            setInputAddress(fullAddress);
          } else if (data.display_name) {
            setInputAddress(data.display_name);
          } else {
            setLocationError(
              "המיקום אותר, אך לא הצלחנו לזהות כתובת. אפשר להזין אותה ידנית."
            );
          }
        }
      } catch {
        if (!active) return;

        if (!addressTouched.current) {
          setLocationError(
            "המיקום אותר, אך לא הצלחנו למלא כתובת אוטומטית. אפשר להזין אותה ידנית."
          );
        }
      } finally {
        if (active) {
          setLocationLoading(false);
          setLocationAction(null);
        }
      }
    };

    getAddressFromCoordinates();

    return () => {
      active = false;
    };
  }, [isLocationReady, savedLatitude, savedLongitude]);

  // שינוי כתובת ידנית
  const handleAddressChange = (value: string) => {
    addressTouched.current = true;

    setInputAddress(value);
    setLatitude(null);
    setLongitude(null);
    setLocationError("");
  };

  // המרת כתובת לקווי רוחב ואורך
  const handleConvertAddress = async () => {
    if (!inputAddress.trim()) {
      setLocationError("יש להזין כתובת לפני ההמרה");
      return;
    }

    setLocationLoading(true);
    setLocationAction("address");
    setLocationError("");

    try {
      const encodedAddress = encodeURIComponent(inputAddress.trim());

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=il&accept-language=he&q=${encodedAddress}`
      );

      if (!response.ok) {
        throw new Error("שגיאה בקבלת נתוני הכתובת");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setLatitude(null);
        setLongitude(null);
        setLocationError(
          "לא הצלחנו למצוא את הכתובת. בדקו את הכתובת ונסו שוב."
        );
        return;
      }

      const lat = Number(data[0].lat);
      const lng = Number(data[0].lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error("הקואורדינטות שהתקבלו אינן תקינות");
      }

      setLatitude(lat);
      setLongitude(lng);
      setLocationError("");
    } catch (err) {
      console.error("Address conversion error:", err);

      setLatitude(null);
      setLongitude(null);

      setLocationError(
        "לא הצלחנו להמיר את הכתובת למיקום. נסו שוב."
      );
    } finally {
      setLocationLoading(false);
      setLocationAction(null);
    }
  };

  // בחירת תמונות
  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  // מעבר לשלב הבא
  const handleNext = () => {
    if (step === 1) {
      if (!inputAddress.trim()) {
        setLocationError("יש להזין כתובת");
        return;
      }

      if (latitude === null || longitude === null) {
        setLocationError(
          "יש לאתר את מיקום המפגע באמצעות המרת הכתובת למיקום"
        );
        return;
      }
    }

    if (step === 2) {
      if (!title.trim() || title.trim().length < 2) {
        setSubmitError("יש להזין כותרת תקינה באורך של לפחות 2 תווים");
        return;
      }

      if (!description.trim() || description.trim().length < 5) {
        setSubmitError("יש להזין תיאור באורך של לפחות 5 תווים");
        return;
      }

      if (categoryId === "") {
        setSubmitError("יש לבחור קטגוריה לדיווח");
        return;
      }

      setSubmitError("");
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const handleBack = () => {
    setSubmitError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  // שליחת דיווח
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");

    if (!inputAddress.trim()) {
      setSubmitError("יש להזין כתובת למפגע");
      return;
    }

    if (
      latitude === null ||
      longitude === null ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setSubmitError("לא זוהה מיקום תקין. יש לבדוק את כתובת המפגע");
      return;
    }

    if (!title.trim() || title.trim().length < 2) {
      setSubmitError("יש להזין כותרת תקינה באורך של לפחות 2 תווים");
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setSubmitError("יש להזין תיאור באורך של לפחות 5 תווים");
      return;
    }

    if (categoryId === "") {
      setSubmitError("יש לבחור קטגוריה לדיווח");
      return;
    }

    try {
      await dispatch(
        createReport({
          categoryId,
          title: title.trim(),
          description: description.trim(),
          latitude,
          longitude,
          inputAddress,
          images,
        })
      ).unwrap();

      setSubmitError("");
      setSuccessMessage(
        "הדיווח נשלח בהצלחה! תודה שעזרתם לנו לשמור על הסביבה."
      );
    } catch (err) {
      console.error("Create report error:", err);

      let message = "אירעה שגיאה בשליחת הדיווח. נסו שוב מאוחר יותר.";

      if (typeof err === "string" && err.trim()) {
        message = err;
      } else if (err && typeof err === "object") {
        const serverError = err as {
          message?: string;
          title?: string;
        };

        message =
          serverError.message ||
          serverError.title ||
          message;
      }

      setSubmitError(message);
    }
  };

  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId
  );

  return (
    <div
      className="report-modal-overlay"
      onClick={successMessage ? undefined : onClose}
    >
      <section
        className="add-report-card"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
      >
        {!successMessage && (
          <button
            type="button"
            className="report-modal-close"
            onClick={onClose}
            aria-label="סגירת חלון"
            disabled={loading}
          >
            ×
          </button>
        )}

        <div className="add-report-heading">
          <span className="add-report-icon">📍</span>
          <h1>דיווח על מפגע</h1>
          <p className="add-report-subtitle">
            יחד נשמור על הסביבה שלנו טובה ובטוחה יותר
          </p>
        </div>

        {!successMessage && (
          <>
            <div className="report-steps">
              {[1, 2, 3].map((number) => (
                <div
                  key={number}
                  className={`report-step ${
                    step >= number ? "active" : ""
                  }`}
                >
                  <span className="report-step-number">
                    {step > number ? "✓" : number}
                  </span>

                  <span className="report-step-label">
                    {number === 1
                      ? "מיקום"
                      : number === 2
                      ? "פרטי הדיווח"
                      : "אישור"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className="report-form-step">
                  <h2>איפה נמצא המפגע?</h2>
                  <p>המיקום שלך נטען מהנתונים שנשמרו בעמוד המפה.</p>

                  {isLocationReady &&
                  savedLatitude !== null &&
                  savedLongitude !== null ? (
                    <div className="location-permission-hint">
                      המיקום הנוכחי שלך זוהה במערכת.
                      אפשר להשתמש בו או להזין כתובת אחרת.
                    </div>
                  ) : (
                    <div className="location-permission-hint">
                      לא נמצא מיקום שמור. אפשר להזין את כתובת המפגע
                      ולהמיר אותה למיקום.
                    </div>
                  )}

                  {locationLoading && locationAction === "saved" && (
                    <p className="report-hint">
                      מזהה את הכתובת לפי המיקום שנשמר...
                    </p>
                  )}

                  <button
                    type="button"
                    className="location-button"
                    onClick={handleConvertAddress}
                    disabled={locationLoading || !inputAddress.trim()}
                  >
                    {locationLoading && locationAction === "address"
                      ? "ממיר כתובת למיקום..."
                      : "📍 המר כתובת למיקום"}
                  </button>

                  {locationError && (
                    <p className="report-error" role="alert">
                      ⚠️ {locationError}
                    </p>
                  )}

                  <div className="add-report-field">
                    <label htmlFor="report-address">
                      כתובת המפגע
                    </label>

                    <input
                      id="report-address"
                      type="text"
                      value={inputAddress}
                      onChange={(event) =>
                        handleAddressChange(event.target.value)
                      }
                      placeholder="הזינו כתובת..."
                    />
                  </div>

                  {latitude !== null && longitude !== null && (
                    <div className="location-toast" role="status">
                      <span>✓</span>
                      המיקום זוהה בהצלחה
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="report-form-step">
                  <h2>ספרו לנו מה קרה</h2>
                  <p>הוסיפו פרטים שיעזרו לנו לטפל במפגע</p>

                  <div className="add-report-field">
                    <label htmlFor="report-title">כותרת הדיווח</label>
                    <input
                      id="report-title"
                      type="text"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        setSubmitError("");
                      }}
                      placeholder="לדוגמה: פנס רחוב לא עובד"
                      minLength={2}
                      maxLength={100}
                    />
                  </div>

                  <div className="add-report-field">
                    <label>קטגוריית הדיווח</label>

                    {categoriesLoading ? (
                      <p>טוען קטגוריות...</p>
                    ) : (
                      <div className="report-category-grid">
                        {categories.map((category) => (
                          <button
                            key={category.categoryId}
                            type="button"
                            className={`report-category ${
                              categoryId === category.categoryId
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => {
                              setCategoryId(category.categoryId);
                              setSubmitError("");
                            }}
                          >
                            {category.categoryName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="add-report-field">
                    <label htmlFor="report-description">
                      תיאור הדיווח
                    </label>
                    <textarea
                      id="report-description"
                      value={description}
                      onChange={(event) => {
                        setDescription(event.target.value);
                        setSubmitError("");
                      }}
                      placeholder="תארו את המפגע..."
                      minLength={5}
                      maxLength={1000}
                    />
                  </div>

                  <div className="add-report-field">
                    <label htmlFor="report-images">
                      צירוף תמונות
                    </label>
                    <input
                      id="report-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                    />

                    {images.length > 0 && (
                      <p className="report-hint">
                        נבחרו {images.length} תמונות
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p className="report-error" role="alert">
                      ⚠️ {submitError}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="report-form-step">
                  <h2>בדקו שהכול נכון</h2>

                  <div className="report-summary">
                    <div className="report-summary-item">
                      <strong>כתובת:</strong>
                      <span>{inputAddress}</span>
                    </div>

                    <div className="report-summary-item">
                      <strong>כותרת:</strong>
                      <span>{title}</span>
                    </div>

                    <div className="report-summary-item">
                      <strong>קטגוריה:</strong>
                      <span>{selectedCategory?.categoryName}</span>
                    </div>

                    <div className="report-summary-item">
                      <strong>תיאור:</strong>
                      <span>{description}</span>
                    </div>

                    <div className="report-summary-item">
                      <strong>תמונות:</strong>
                      <span>{images.length} תמונות</span>
                    </div>
                  </div>

                  {(submitError || error) && (
                    <p className="report-error" role="alert">
                      ⚠️ {submitError || error}
                    </p>
                  )}
                </div>
              )}

              {step !== 2 && step !== 3 && error && (
                <p className="report-error" role="alert">
                  ⚠️ {error}
                </p>
              )}

              <div className="report-form-actions">
                {step > 1 && (
                  <button
                    type="button"
                    className="report-back-button"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    חזרה
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    className="add-report-submit"
                    onClick={handleNext}
                    disabled={loading || locationLoading}
                  >
                    המשך
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="add-report-submit"
                    disabled={loading}
                  >
                    {loading ? "שולח דיווח..." : "שליחת דיווח"}
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {successMessage && (
          <div className="report-success-message" role="status">
            <span className="report-success-icon">✓</span>
            <h2>הדיווח התקבל!</h2>
            <p>{successMessage}</p>
            <button
              type="button"
              onClick={onClose}
              className="report-success-close"
            >
              סגירה
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default AddReport;
