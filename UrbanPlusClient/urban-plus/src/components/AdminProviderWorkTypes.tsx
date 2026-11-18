
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchProviderWorkTypes,
  createProviderWorkType,
  deleteProviderWorkType,
} from "../store/providerWorkTypes/providerWorkTypesThunks";

import { fetchServiceProviders } from "../store/serviceProviders/serviceProvidersThunks";
import { fetchWorkTypes } from "../store/workTypes/workTypesThunks";

import "./AdminProviderWorkTypes.css";

function AdminProviderWorkTypes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);

  const providers = useAppSelector(
    (state) => state.serviceProviders.serviceProviders
  );

  const workTypes = useAppSelector(
    (state) => state.workTypes.workTypes
  );

  const assignments = useAppSelector(
    (state) => state.providerWorkTypes.providerWorkTypes
  );

  const loading = useAppSelector(
    (state) => state.providerWorkTypes.loading
  );

  const error = useAppSelector(
    (state) => state.providerWorkTypes.error
  );

  const [search, setSearch] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchProviderWorkTypes());
      dispatch(fetchServiceProviders());
      dispatch(fetchWorkTypes());
    }
  }, [dispatch, token]);

  const filteredAssignments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return assignments;

    return assignments.filter(
      (item) =>
        item.providerName?.toLowerCase().includes(searchValue) ||
        item.nameWorkTypes?.toLowerCase().includes(searchValue)
    );
  }, [assignments, search]);

  const openCreateModal = () => {
    setSelectedProviderId("");
    setSelectedWorkTypeId("");
    setFormError("");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setSelectedProviderId("");
    setSelectedWorkTypeId("");
    setFormError("");
  };

  const handleSave = async () => {
    const providerId = Number(selectedProviderId);
    const workTypeId = Number(selectedWorkTypeId);

    if (!providerId || providerId <= 0) {
      setFormError("יש לבחור נותן שירות");
      return;
    }

    if (!workTypeId || workTypeId <= 0) {
      setFormError("יש לבחור סוג עבודה");
      return;
    }

    const alreadyExists = assignments.some(
      (item) =>
        item.providerId === providerId &&
        item.workTypeId === workTypeId
    );

    if (alreadyExists) {
      setFormError("השילוב הזה כבר קיים במערכת");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      await dispatch(
        createProviderWorkType({
          providerId,
          workTypeId,
        })
      ).unwrap();

      setShowFormModal(false);
      setSelectedProviderId("");
      setSelectedWorkTypeId("");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : "הוספת השיוך נכשלה. נסי שוב"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "האם את בטוחה שברצונך למחוק את השיוך?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await dispatch(deleteProviderWorkType(id)).unwrap();
    } catch {
      alert("מחיקת השיוך נכשלה. נסי שוב");
    } finally {
      setDeletingId(null);
    }
  };

  if (!token) {
    return (
      <div className="admin-provider-work-types-page admin-provider-work-types-embedded">
        <div className="admin-provider-work-types-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-provider-work-types-page admin-provider-work-types-embedded">
      <main className="admin-provider-work-types-content">
        <section className="admin-provider-work-types-summary">
          <div className="admin-provider-work-types-summary-icon">🔗</div>
          <div>
            <span>סה"כ שיוכים במערכת</span>
            <strong>{assignments.length}</strong>
          </div>
        </section>

        <section className="admin-provider-work-types-card">
          <div className="admin-provider-work-types-toolbar">
            <div>
              <h2>רשימת שיוכים</h2>
              <p>ניהול סוגי העבודה המשויכים לנותני השירות</p>
            </div>

            <div className="admin-provider-work-types-toolbar-actions">
              <div className="admin-provider-work-types-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="חיפוש לפי נותן שירות או סוג עבודה..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="admin-provider-work-types-add-button"
                onClick={openCreateModal}
              >
                + שיוך חדש
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-provider-work-types-message">
              <div className="admin-provider-work-types-loader" />
              <p>טוען שיוכים...</p>
            </div>
          ) : error ? (
            <div className="admin-provider-work-types-error">
              {error}
              <button onClick={() => dispatch(fetchProviderWorkTypes())}>
                נסי שוב
              </button>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="admin-provider-work-types-empty">
              <span>🔍</span>
              <h3>לא נמצאו שיוכים</h3>
              <p>
                {search
                  ? "נסי לחפש לפי שם אחר"
                  : "עדיין אין שיוכים במערכת"}
              </p>
            </div>
          ) : (
            <div className="admin-provider-work-types-table-wrapper">
              <table className="admin-provider-work-types-table">
                <thead>
                  <tr>
                    <th>מזהה</th>
                    <th>נותן השירות</th>
                    <th>סוג העבודה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((item) => (
                    <tr key={item.providerWorkTypesId}>
                      <td>{item.providerWorkTypesId}</td>

                      <td>
                        <strong className="admin-provider-work-type-name">
                          {item.providerName}
                        </strong>
                      </td>

                      <td>
                        <span className="admin-provider-work-type-category">
                          {item.nameWorkTypes}
                        </span>
                      </td>

                      <td>
                        <div className="admin-provider-work-type-actions">
                          <button
                            className="admin-provider-work-type-delete-button"
                            onClick={() =>
                              handleDelete(item.providerWorkTypesId)
                            }
                            disabled={
                              deletingId === item.providerWorkTypesId
                            }
                          >
                            {deletingId === item.providerWorkTypesId
                              ? "מוחק..."
                              : "מחיקה"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredAssignments.length > 0 && (
            <div className="admin-provider-work-types-footer">
              מציג {filteredAssignments.length} מתוך {assignments.length} שיוכים
            </div>
          )}
        </section>
      </main>

      {showFormModal && (
        <div
          className="admin-provider-work-types-modal-overlay"
          onClick={closeFormModal}
        >
          <div
            className="admin-provider-work-types-form-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-provider-work-types-modal-heading">
              <div>
                <h2>הוספת שיוך חדש</h2>
                <p>בחרי נותן שירות וסוג עבודה לשיוך</p>
              </div>

              <button
                className="admin-provider-work-types-close-button"
                onClick={closeFormModal}
                disabled={saving}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <label htmlFor="provider-work-type-provider">
              נותן שירות <span>*</span>
            </label>

            <select
              id="provider-work-type-provider"
              value={selectedProviderId}
              onChange={(e) => {
                setSelectedProviderId(e.target.value);
                setFormError("");
              }}
            >
              <option value="">בחרי נותן שירות</option>
              {providers
                .filter((provider) => provider.isActive)
                .map((provider) => (
                  <option
                    key={provider.providerId}
                    value={provider.providerId}
                  >
                    {provider.fullName}
                  </option>
                ))}
            </select>

            <label htmlFor="provider-work-type-work">
              סוג עבודה <span>*</span>
            </label>

            <select
              id="provider-work-type-work"
              value={selectedWorkTypeId}
              onChange={(e) => {
                setSelectedWorkTypeId(e.target.value);
                setFormError("");
              }}
            >
              <option value="">בחרי סוג עבודה</option>
              {workTypes.map((workType) => (
                <option
                  key={workType.workTypeId}
                  value={workType.workTypeId}
                >
                  {workType.nameWorkTypes}
                </option>
              ))}
            </select>

            {formError && (
              <div className="admin-provider-work-types-modal-error">
                {formError}
              </div>
            )}

            <div className="admin-provider-work-types-modal-actions">
              <button
                className="admin-provider-work-types-modal-cancel"
                onClick={closeFormModal}
                disabled={saving}
              >
                ביטול
              </button>

              <button
                className="admin-provider-work-types-modal-confirm"
                onClick={handleSave}
                disabled={
                  !selectedProviderId ||
                  !selectedWorkTypeId ||
                  saving
                }
              >
                {saving ? "שומר..." : "הוספת שיוך"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProviderWorkTypes;
