
import { useEffect, useState } from "react";
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

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("הדפדפן אינו תומך באיתור מיקום");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=he`
          );

          if (!response.ok) {
            throw new Error("לא ניתן לקבל כתובת");
          }

          const data = await response.json();

          const address = data.address;
          const street =
            address.road ||
            address.pedestrian ||
            address.footway ||
            "";

          const houseNumber = address.house_number || "";
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "";

          const fullAddress = [
            street && `${street} ${houseNumber}`.trim(),
            city,
          ]
            .filter(Boolean)
            .join(", ");

          if (fullAddress) {
            setInputAddress(fullAddress);
          } else if (data.display_name) {
            setInputAddress(data.display_name);
          } else {
            setLocationError(
              "המיקום אותר, אך לא הצלחנו לזהות כתובת. אפשר להזין אותה ידנית."
            );
          }
        } catch {
          setLocationError(
            "המיקום אותר, אך לא הצלחנו למלא כתובת אוטומטית. אפשר להזין אותה ידנית."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError("לא ניתנה הרשאה לאיתור המיקום");
        } else {
          setLocationError("לא הצלחנו לאתר את המיקום שלך");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  };

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!inputAddress.trim()) {
        setLocationError("יש להזין כתובת");
        return;
      }

      if (latitude === null || longitude === null) {
        setLocationError("יש לאתר את המיקום באמצעות GPS");
        return;
      }
    }

    if (step === 2) {
      if (
        !title.trim() ||
        title.trim().length < 2 ||
        !description.trim() ||
        description.trim().length < 5 ||
        categoryId === ""
      ) {
        return;
      }
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      categoryId === "" ||
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    try {
      await dispatch(
        createReport({
          categoryId,
          title,
          description,
          latitude,
          longitude,
          inputAddress,
          images,
        })
      ).unwrap();

      alert("הדיווח נשלח בהצלחה!");
      onClose();
    } catch (err) {
      console.error("Create report error:", err);
    }
  };

  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId
  );

  return (
    <div
      className="report-modal-overlay"
      onClick={onClose}
    >
      <section
        className="add-report-card"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="report-modal-close"
          onClick={onClose}
          aria-label="סגירת חלון"
          disabled={loading}
        >
          ×
        </button>

        <div className="add-report-heading">
          <span className="add-report-icon">📍</span>
          <h1>דיווח על מפגע</h1>
          <p className="add-report-subtitle">
            יחד נשמור על הסביבה שלנו טובה ובטוחה יותר
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="report-form-step">
              <h2>איפה נמצא המפגע?</h2>
              <p>אתרו את המיקום והכתובת תתמלא אוטומטית</p>

              <button
                type="button"
                className="location-button"
                onClick={handleGetLocation}
                disabled={locationLoading}
              >
                {locationLoading
                  ? "מאתר מיקום וכתובת..."
                  : "📍 השתמש במיקום הנוכחי שלי"}
              </button>

              {latitude !== null && longitude !== null && (
                <div className="location-success">
                  ✓ המיקום אותר בהצלחה
                  <small>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </small>
                </div>
              )}

              {locationError && (
                <p className="report-error">{locationError}</p>
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
                    setInputAddress(event.target.value)
                  }
                  placeholder="הכתובת תתמלא לאחר איתור המיקום"
                  required
                />
              </div>
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
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="לדוגמה: פנס רחוב לא עובד"
                  required
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
                        onClick={() =>
                          setCategoryId(category.categoryId)
                        }
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
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="תארו את המפגע..."
                  required
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
            </div>
          )}

          {error && (
            <p className="report-error">{error}</p>
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
                disabled={loading}
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
      </section>
    </div>
  );
}

export default AddReport;
