
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  fetchWorkTypes,
  createWorkType,
  updateWorkType,
} from "../store/workTypes/workTypesThunks";

import { fetchCategories } from "../store/categories/categoriesThunks";

import type { WorkType } from "../store/workTypes/workTypesState";

import "./AdminWorkTypes.css";

function AdminWorkTypes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);

  const workTypes = useAppSelector(
    (state) => state.workTypes.workTypes
  );

  const loading = useAppSelector(
    (state) => state.workTypes.loading
  );

  const error = useAppSelector(
    (state) => state.workTypes.error
  );

  const categories = useAppSelector(
    (state) => state.categories.categories
  );

  const [search, setSearch] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingWorkType, setEditingWorkType] =
    useState<WorkType | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [workTypeName, setWorkTypeName] = useState("");
  const [description, setDescription] = useState("");

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchWorkTypes());
      dispatch(fetchCategories());
    }
  }, [dispatch, token]);

  const filteredWorkTypes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return workTypes;

    return workTypes.filter(
      (workType) =>
        workType.nameWorkTypes?.toLowerCase().includes(searchValue) ||
        workType.categoryName?.toLowerCase().includes(searchValue) ||
        workType.description?.toLowerCase().includes(searchValue)
    );
  }, [workTypes, search]);

  const openCreateModal = () => {
    setEditingWorkType(null);
    setCategoryId("");
    setWorkTypeName("");
    setDescription("");
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (workType: WorkType) => {
    setEditingWorkType(workType);
    setCategoryId(String(workType.categoryId));
    setWorkTypeName(workType.nameWorkTypes);
    setDescription(workType.description || "");
    setFormError("");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setEditingWorkType(null);
    setCategoryId("");
    setWorkTypeName("");
    setDescription("");
    setFormError("");
  };

  const handleSave = async () => {
    const trimmedName = workTypeName.trim();
    const trimmedDescription = description.trim();
    const selectedCategoryId = Number(categoryId);

    if (!selectedCategoryId || selectedCategoryId <= 0) {
      setFormError("יש לבחור קטגוריה");
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 200) {
      setFormError("שם סוג העבודה חייב להכיל בין 2 ל-200 תווים");
      return;
    }

    if (trimmedDescription.length > 500) {
      setFormError("התיאור לא יכול לעלות על 500 תווים");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editingWorkType) {
        await dispatch(
          updateWorkType({
            workTypeId: editingWorkType.workTypeId,
            categoryId: selectedCategoryId,
            nameWorkTypes: trimmedName,
            description: trimmedDescription || null,
          })
        ).unwrap();
      } else {
        await dispatch(
          createWorkType({
            categoryId: selectedCategoryId,
            nameWorkTypes: trimmedName,
            description: trimmedDescription || null,
          })
        ).unwrap();
      }

      setShowFormModal(false);
      setEditingWorkType(null);
      setCategoryId("");
      setWorkTypeName("");
      setDescription("");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : "שמירת סוג העבודה נכשלה. נסי שוב"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-work-types-page admin-work-types-embedded">
        <div className="admin-work-types-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-work-types-page admin-work-types-embedded">
      <main className="admin-work-types-content">
        <section className="admin-work-types-summary">
          <div className="admin-work-types-summary-icon">🛠️</div>
          <div>
            <span>סה"כ סוגי עבודה</span>
            <strong>{workTypes.length}</strong>
          </div>
        </section>

        <section className="admin-work-types-card">
          <div className="admin-work-types-toolbar">
            <div>
              <h2>רשימת סוגי עבודה</h2>
              <p>הוספה ועריכה של סוגי העבודה במערכת</p>
            </div>

            <div className="admin-work-types-toolbar-actions">
              <div className="admin-work-types-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="חיפוש לפי שם, קטגוריה או תיאור..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="admin-work-types-add-button"
                onClick={openCreateModal}
              >
                + סוג עבודה חדש
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-work-types-message">
              <div className="admin-work-types-loader" />
              <p>טוען סוגי עבודה...</p>
            </div>
          ) : error ? (
            <div className="admin-work-types-error">
              {error}
              <button onClick={() => dispatch(fetchWorkTypes())}>
                נסי שוב
              </button>
            </div>
          ) : filteredWorkTypes.length === 0 ? (
            <div className="admin-work-types-empty">
              <span>🔍</span>
              <h3>לא נמצאו סוגי עבודה</h3>
              <p>
                {search
                  ? "נסי לחפש לפי שם או קטגוריה אחרת"
                  : "עדיין אין סוגי עבודה במערכת"}
              </p>
            </div>
          ) : (
            <div className="admin-work-types-table-wrapper">
              <table className="admin-work-types-table">
                <thead>
                  <tr>
                    <th>מזהה</th>
                    <th>שם סוג העבודה</th>
                    <th>קטגוריה</th>
                    <th>תיאור</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWorkTypes.map((workType) => (
                    <tr key={workType.workTypeId}>
                      <td>{workType.workTypeId}</td>

                      <td>
                        <strong className="admin-work-type-name">
                          {workType.nameWorkTypes}
                        </strong>
                      </td>

                      <td>
                        <span className="admin-work-type-category">
                          {workType.categoryName || "—"}
                        </span>
                      </td>

                      <td className="admin-work-type-description">
                        {workType.description || "—"}
                      </td>

                      <td>
                        <div className="admin-work-type-actions">
                          <button
                            className="admin-work-type-edit-button"
                            onClick={() => openEditModal(workType)}
                          >
                            עריכה
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredWorkTypes.length > 0 && (
            <div className="admin-work-types-footer">
              מציג {filteredWorkTypes.length} מתוך {workTypes.length} סוגי עבודה
            </div>
          )}
        </section>
      </main>

      {showFormModal && (
        <div
          className="admin-work-types-modal-overlay"
          onClick={closeFormModal}
        >
          <div
            className="admin-work-types-form-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-work-type-form-title"
          >
            <div className="admin-work-types-modal-heading">
              <div>
                <h2 id="admin-work-type-form-title">
                  {editingWorkType
                    ? "עריכת סוג עבודה"
                    : "הוספת סוג עבודה"}
                </h2>
                <p>
                  {editingWorkType
                    ? "עדכון פרטי סוג העבודה"
                    : "הזיני את פרטי סוג העבודה החדש"}
                </p>
              </div>

              <button
                className="admin-work-types-close-button"
                onClick={closeFormModal}
                disabled={saving}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <label htmlFor="admin-work-type-category">
              קטגוריה <span>*</span>
            </label>

            <select
              id="admin-work-type-category"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setFormError("");
              }}
            >
              <option value="">בחרי קטגוריה</option>
              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>

            <label htmlFor="admin-work-type-name">
              שם סוג העבודה <span>*</span>
            </label>

            <input
              id="admin-work-type-name"
              type="text"
              value={workTypeName}
              onChange={(e) => {
                setWorkTypeName(e.target.value);
                setFormError("");
              }}
              placeholder="לדוגמה: איסוף פסולת"
              maxLength={200}
            />

            <div className="admin-work-types-character-count">
              {workTypeName.length}/200
            </div>

            <label htmlFor="admin-work-type-description">
              תיאור סוג העבודה
            </label>

            <textarea
              id="admin-work-type-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormError("");
              }}
              placeholder="תיאור קצר של סוג העבודה..."
              rows={4}
              maxLength={500}
            />

            <div className="admin-work-types-character-count">
              {description.length}/500
            </div>

            {formError && (
              <div className="admin-work-types-modal-error">
                {formError}
              </div>
            )}

            <div className="admin-work-types-modal-actions">
              <button
                className="admin-work-types-modal-cancel"
                onClick={closeFormModal}
                disabled={saving}
              >
                ביטול
              </button>

              <button
                className="admin-work-types-modal-confirm"
                onClick={handleSave}
                disabled={
                  !categoryId ||
                  workTypeName.trim().length < 2 ||
                  workTypeName.trim().length > 200 ||
                  saving
                }
              >
                {saving
                  ? "שומר..."
                  : editingWorkType
                    ? "שמירת שינויים"
                    : "הוספת סוג עבודה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWorkTypes;
