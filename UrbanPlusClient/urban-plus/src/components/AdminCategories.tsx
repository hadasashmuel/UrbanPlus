
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/categories/categoriesThunks";
import type { Category } from "../store/categories/categoriesState";
import "./AdminCategories.css";

function AdminCategories() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const categories = useAppSelector(
    (state) => state.categories.categories
  );
  const loading = useAppSelector(
    (state) => state.categories.loading
  );
  const error = useAppSelector(
    (state) => state.categories.error
  );

  const [search, setSearch] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] =
    useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
    }
  }, [dispatch, token]);

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return categories;

    return categories.filter(
      (category) =>
        category.categoryName?.toLowerCase().includes(searchValue) ||
        category.categoryDescription?.toLowerCase().includes(searchValue)
    );
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription || "");
    setFormError("");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setFormError("");
  };

  const handleSave = async () => {
    const trimmedName = categoryName.trim();
    const trimmedDescription = categoryDescription.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setFormError("שם הקטגוריה חייב להכיל בין 2 ל-50 תווים");
      return;
    }

    if (trimmedDescription.length > 250) {
      setFormError("תיאור הקטגוריה לא יכול לעלות על 250 תווים");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory.categoryId,
            categoryData: {
              categoryName: trimmedName,
              categoryDescription: trimmedDescription,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createCategory({
            categoryName: trimmedName,
            categoryDescription: trimmedDescription,
          })
        ).unwrap();
      }

      setShowFormModal(false);
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : "שמירת הקטגוריה נכשלה. נסי שוב"
      );
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedCategory(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await dispatch(
        deleteCategory(selectedCategory.categoryId)
      ).unwrap();

      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      setDeleteError(
        typeof err === "string"
          ? err
          : "מחיקת הקטגוריה נכשלה. ייתכן שהיא משויכת לאירועים"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-categories-page admin-categories-embedded">
        <div className="admin-categories-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categories-page admin-categories-embedded">
      <main className="admin-categories-content">
        <section className="admin-categories-summary">
          <div className="admin-categories-summary-icon">🏷️</div>
          <div>
            <span>סה"כ קטגוריות</span>
            <strong>{categories.length}</strong>
          </div>
        </section>

        <section className="admin-categories-card">
          <div className="admin-categories-toolbar">
            <div>
              <h2>רשימת קטגוריות</h2>
              <p>הוספה, עריכה ומחיקה של קטגוריות במערכת</p>
            </div>

            <div className="admin-categories-toolbar-actions">
              <div className="admin-categories-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="חיפוש לפי שם או תיאור..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="admin-categories-add-button"
                onClick={openCreateModal}
              >
                + קטגוריה חדשה
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-categories-message">
              <div className="admin-categories-loader" />
              <p>טוען קטגוריות...</p>
            </div>
          ) : error ? (
            <div className="admin-categories-error">
              {error}
              <button onClick={() => dispatch(fetchCategories())}>
                נסי שוב
              </button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="admin-categories-empty">
              <span>🔍</span>
              <h3>לא נמצאו קטגוריות</h3>
              <p>
                {search
                  ? "נסי לחפש לפי שם או תיאור אחר"
                  : "עדיין אין קטגוריות במערכת"}
              </p>
            </div>
          ) : (
            <div className="admin-categories-table-wrapper">
              <table className="admin-categories-table">
                <thead>
                  <tr>
                    <th>מזהה</th>
                    <th>שם הקטגוריה</th>
                    <th>תיאור</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.categoryId}>
                      <td>{category.categoryId}</td>

                      <td>
                        <strong className="admin-category-name">
                          {category.categoryName}
                        </strong>
                      </td>

                      <td className="admin-category-description">
                        {category.categoryDescription || "—"}
                      </td>

                      <td>
                        <div className="admin-category-actions">
                          <button
                            className="admin-category-edit-button"
                            onClick={() => openEditModal(category)}
                          >
                            עריכה
                          </button>

                          <button
                            className="admin-category-delete-button"
                            onClick={() => openDeleteModal(category)}
                          >
                            מחיקה
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredCategories.length > 0 && (
            <div className="admin-categories-footer">
              מציג {filteredCategories.length} מתוך {categories.length} קטגוריות
            </div>
          )}
        </section>
      </main>

      {showFormModal && (
        <div
          className="admin-categories-modal-overlay"
          onClick={closeFormModal}
        >
          <div
            className="admin-categories-form-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-category-form-title"
          >
            <div className="admin-categories-modal-heading">
              <div>
                <h2 id="admin-category-form-title">
                  {editingCategory ? "עריכת קטגוריה" : "הוספת קטגוריה"}
                </h2>
                <p>
                  {editingCategory
                    ? "עדכון פרטי הקטגוריה"
                    : "הזיני את פרטי הקטגוריה החדשה"}
                </p>
              </div>

              <button
                className="admin-categories-close-button"
                onClick={closeFormModal}
                disabled={saving}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <label htmlFor="admin-category-name">
              שם הקטגוריה <span>*</span>
            </label>

            <input
              id="admin-category-name"
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setFormError("");
              }}
              placeholder="לדוגמה: ניקיון עירוני"
              maxLength={50}
            />

            <div className="admin-categories-character-count">
              {categoryName.length}/50
            </div>

            <label htmlFor="admin-category-description">
              תיאור הקטגוריה
            </label>

            <textarea
              id="admin-category-description"
              value={categoryDescription}
              onChange={(e) => {
                setCategoryDescription(e.target.value);
                setFormError("");
              }}
              placeholder="תיאור קצר של הקטגוריה..."
              rows={4}
              maxLength={250}
            />

            <div className="admin-categories-character-count">
              {categoryDescription.length}/250
            </div>

            {formError && (
              <div className="admin-categories-modal-error">
                {formError}
              </div>
            )}

            <div className="admin-categories-modal-actions">
              <button
                className="admin-categories-modal-cancel"
                onClick={closeFormModal}
                disabled={saving}
              >
                ביטול
              </button>

              <button
                className="admin-categories-modal-confirm"
                onClick={handleSave}
                disabled={
                  categoryName.trim().length < 2 ||
                  categoryName.trim().length > 50 ||
                  saving
                }
              >
                {saving
                  ? "שומר..."
                  : editingCategory
                    ? "שמירת שינויים"
                    : "הוספת קטגוריה"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCategory && (
        <div
          className="admin-categories-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="admin-categories-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-category-delete-title"
          >
            <div className="admin-categories-modal-icon">!</div>

            <h2 id="admin-category-delete-title">מחיקת קטגוריה</h2>

            <p>
              האם את בטוחה שברצונך למחוק את הקטגוריה
              <strong> {selectedCategory.categoryName}</strong>?
            </p>

            <p className="admin-categories-delete-warning">
              שימי לב: מחיקת קטגוריה המשויכת לאירועים עלולה להיכשל.
            </p>

            {deleteError && (
              <div className="admin-categories-modal-error">
                {deleteError}
              </div>
            )}

            <div className="admin-categories-modal-actions">
              <button
                className="admin-categories-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                ביטול
              </button>

              <button
                className="admin-categories-delete-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "מוחק..." : "אישור מחיקה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
