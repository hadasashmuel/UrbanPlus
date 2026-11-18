
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchServiceProviders,
  createServiceProvider,
  updateServiceProvider,
} from "../store/serviceProviders/serviceProvidersThunks";

import type { ServiceProvider } from "../store/serviceProviders/serviceProvidersState";

import "./AdminServiceProviders.css";

function AdminServiceProviders() {
  const dispatch = useAppDispatch();

  const serviceProviders = useAppSelector(
    (state) => state.serviceProviders.serviceProviders
  );

  const loading = useAppSelector(
    (state) => state.serviceProviders.loading
  );

  const error = useAppSelector(
    (state) => state.serviceProviders.error
  );

  const [showForm, setShowForm] = useState(false);

  const [editingProviderId, setEditingProviderId] =
    useState<number | null>(null);

  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  // טעינת ספקי השירות
  useEffect(() => {
    dispatch(fetchServiceProviders());
  }, [dispatch]);

  // איפוס הטופס
  const resetForm = () => {
    setFullName("");
    setDepartment("");
    setPhone("");
    setEmail("");
    setEditingProviderId(null);
    setShowForm(false);
  };

  // פתיחת טופס הוספה
  const handleAdd = () => {
    resetForm();
    setMessage("");
    setShowForm(true);
  };

  // פתיחת טופס עריכה
  const handleEdit = (provider: ServiceProvider) => {
    setEditingProviderId(provider.providerId);
    setFullName(provider.fullName);
    setDepartment(provider.department || "");
    setPhone(provider.phone || "");
    setEmail(provider.email || "");
    setShowForm(true);
    setMessage("");
  };

  // הוספה או עדכון ספק
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setMessage("");

    const providerData = {
      fullName: fullName.trim(),
      department: department.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
    };

    const isEditing = editingProviderId !== null;

    try {
      if (isEditing) {
        const currentProvider = serviceProviders.find(
          (provider) =>
            provider.providerId === editingProviderId
        );

        if (!currentProvider) {
          setMessage("לא נמצא ספק השירות");
          return;
        }

        await dispatch(
          updateServiceProvider({
            providerId: editingProviderId,
            ...providerData,
            isActive: currentProvider.isActive,
          })
        ).unwrap();
      } else {
        await dispatch(
          createServiceProvider(providerData)
        ).unwrap();
      }

      resetForm();

      setMessage(
        isEditing
          ? "הספק עודכן בהצלחה!"
          : "הספק נוסף בהצלחה!"
      );
    } catch {
      setMessage(
        "הפעולה נכשלה. בדקי את הפרטים ונסי שוב."
      );
    }
  };

  // הפעלה או השבתה של ספק
  const handleToggleActive = async (
    provider: ServiceProvider
  ) => {
    const confirmed = window.confirm(
      provider.isActive
        ? `האם להשבית את ${provider.fullName}?`
        : `האם להפעיל מחדש את ${provider.fullName}?`
    );

    if (!confirmed) return;

    setMessage("");

    try {
      await dispatch(
        updateServiceProvider({
          providerId: provider.providerId,
          fullName: provider.fullName,
          department: provider.department,
          phone: provider.phone,
          email: provider.email,
          isActive: !provider.isActive,
        })
      ).unwrap();

      setMessage(
        provider.isActive
          ? "הספק הושבת בהצלחה!"
          : "הספק הופעל בהצלחה!"
      );
    } catch {
      setMessage("לא ניתן לשנות את סטטוס הספק");
    }
  };

  return (
    <div className="service-providers-page">

      {/* כותרת */}
      <header className="service-providers-header">
        <div>
          <h1>ניהול ספקי שירות</h1>
          <p>
            הוספה, עריכה וניהול ספקי השירות העירוניים
          </p>
        </div>

        <div className="service-providers-count">
          {serviceProviders.length} ספקים
        </div>
      </header>

      {/* כפתור הוספה */}
      <div className="service-providers-actions">
        <button
          className="add-provider-button"
          onClick={handleAdd}
        >
          + הוספת ספק שירות
        </button>
      </div>

      {/* טופס הוספה ועריכה */}
      {showForm && (
        <form
          className="provider-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingProviderId !== null
              ? "עריכת ספק שירות"
              : "הוספת ספק שירות חדש"}
          </h2>

          <label>שם מלא *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            minLength={2}
            maxLength={200}
            required
            placeholder="שם ספק השירות"
          />

          <label>מחלקה</label>
          <input
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            maxLength={200}
            placeholder="שם המחלקה"
          />

          <label>טלפון</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            maxLength={20}
            placeholder="מספר טלפון"
          />

          <label>דואר אלקטרוני</label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            maxLength={300}
            placeholder="כתובת אימייל"
          />

          <div className="provider-form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "שומר..."
                : editingProviderId !== null
                  ? "שמירת שינויים"
                  : "הוספת ספק"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              ביטול
            </button>
          </div>
        </form>
      )}

      {/* הודעות */}
      {message && (
        <p className="provider-message">
          {message}
        </p>
      )}

      {error && (
        <p className="service-providers-error">
          {error}
        </p>
      )}

      {/* רשימת ספקים */}
      <div className="service-providers-list">

        {loading && serviceProviders.length === 0 ? (
          <p>טוען ספקי שירות...</p>
        ) : serviceProviders.length === 0 ? (
          <p>לא נמצאו ספקי שירות במערכת</p>
        ) : (
          serviceProviders.map((provider) => (
            <div
              className="service-provider-card"
              key={provider.providerId}
            >
              <div className="provider-card-header">
                <h3>{provider.fullName}</h3>

                <span
                  className={
                    provider.isActive
                      ? "active"
                      : "inactive"
                  }
                >
                  {provider.isActive
                    ? "פעיל"
                    : "לא פעיל"}
                </span>
              </div>

              <p>
                <strong>מחלקה:</strong>{" "}
                {provider.department || "לא צוין"}
              </p>

              <p>
                <strong>טלפון:</strong>{" "}
                {provider.phone || "לא צוין"}
              </p>

              <p>
                <strong>דוא״ל:</strong>{" "}
                {provider.email || "לא צוין"}
              </p>

              <div className="provider-card-actions">
                <button
                  className="edit-provider-button"
                  onClick={() => handleEdit(provider)}
                >
                  עריכה
                </button>

                <button
                  className={
                    provider.isActive
                      ? "deactivate-provider-button"
                      : "activate-provider-button"
                  }
                  onClick={() =>
                    handleToggleActive(provider)
                  }
                >
                  {provider.isActive
                    ? "השבתה"
                    : "הפעלה"}
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default AdminServiceProviders;
