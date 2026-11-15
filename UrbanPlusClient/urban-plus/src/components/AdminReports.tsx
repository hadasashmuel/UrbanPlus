
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllReports,
  deleteReport,
} from "../store/reports/reportsThunks";
import type { Report } from "../store/reports/reportsState";
import "./AdminReports.css";

function AdminReports() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const reports = useAppSelector((state) => state.reports.allReports);
  const loading = useAppSelector((state) => state.reports.loading);
  const error = useAppSelector((state) => state.reports.error);

  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllReports());
    }
  }, [dispatch, token]);

  const filteredReports = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return reports;

    return reports.filter((report) => {
      return (
        report.title?.toLowerCase().includes(searchValue) ||
        report.description?.toLowerCase().includes(searchValue) ||
        report.categoryName?.toLowerCase().includes(searchValue) ||
        report.inputAddress?.toLowerCase().includes(searchValue)
      );
    });
  }, [reports, search]);

  const selectedDeleteReport = reports.find(
    (report) => report.reportId === selectedReportId
  );

  const openDetailsModal = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReport(null);
  };

  const openDeleteModal = (reportId: number) => {
    setSelectedReportId(reportId);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedReportId(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (selectedReportId === null || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await dispatch(deleteReport(selectedReportId)).unwrap();
      setShowDeleteModal(false);
      setSelectedReportId(null);

      if (selectedReport?.reportId === selectedReportId) {
        closeDetailsModal();
      }
    } catch (error) {
      setDeleteError(
        typeof error === "string"
          ? error
          : "מחיקת הדיווח נכשלה. נסי שוב"
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("he-IL");
  };

  const formatValue = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    return String(value);
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) return imageUrl;

    return `https://localhost:7019/${imageUrl.replace(/^\/+/, "")}`;
  };

  if (!token) {
    return (
      <div className="admin-reports-page admin-reports-embedded">
        <div className="admin-reports-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page admin-reports-embedded">
      <main className="admin-reports-content">
        <section className="admin-reports-summary">
          <div className="admin-reports-summary-icon">📢</div>
          <div>
            <span>סה"כ דיווחים</span>
            <strong>{reports.length}</strong>
          </div>
        </section>

        <section className="admin-reports-card">
          <div className="admin-reports-toolbar">
            <div>
              <h2>רשימת דיווחים</h2>
              <p>צפייה בפרטי הדיווחים וניהול הרשומות במערכת</p>
            </div>

            <div className="admin-reports-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="חיפוש לפי כותרת, תיאור, כתובת או קטגוריה..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-reports-message">
              <div className="admin-reports-loader" />
              <p>טוען דיווחים...</p>
            </div>
          ) : error ? (
            <div className="admin-reports-error">
              {error}
              <button onClick={() => dispatch(fetchAllReports())}>
                נסי שוב
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="admin-reports-empty">
              <span>🔍</span>
              <h3>לא נמצאו דיווחים</h3>
              <p>
                {search
                  ? "נסי לחפש לפי כותרת, תיאור או קטגוריה אחרת"
                  : "עדיין אין דיווחים להצגה"}
              </p>
            </div>
          ) : (
            <div className="admin-reports-table-wrapper">
              <table className="admin-reports-table">
                <thead>
                  <tr>
                    <th>כותרת</th>
                    <th>קטגוריה</th>
                    <th>כתובת</th>
                    <th>מזהה משתמש</th>
                    <th>תמונות</th>
                    <th>תאריך יצירה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.reportId}>
                      <td>
                        <strong className="admin-report-title">
                          {report.title}
                        </strong>
                      </td>

                      <td>
                        <span className="admin-report-category">
                          {report.categoryName || "—"}
                        </span>
                      </td>

                      <td className="admin-report-address">
                        {report.inputAddress || "—"}
                      </td>

                      <td>{report.userId}</td>

                      <td>
                        {report.imageList?.length ?? 0}
                      </td>

                      <td>{formatDate(report.createdAt)}</td>

                      <td>
                        <div className="admin-report-actions">
                          <button
                            className="admin-report-details-button"
                            onClick={() => openDetailsModal(report)}
                          >
                            פרטים
                          </button>

                          <button
                            className="admin-report-delete-button"
                            onClick={() => openDeleteModal(report.reportId)}
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

          {!loading && !error && filteredReports.length > 0 && (
            <div className="admin-reports-footer">
              מציג {filteredReports.length} מתוך {reports.length} דיווחים
            </div>
          )}
        </section>
      </main>

      {showDetailsModal && selectedReport && (
        <div
          className="admin-reports-modal-overlay"
          onClick={closeDetailsModal}
        >
          <div
            className="admin-reports-details-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-report-details-title"
          >
            <div className="admin-reports-details-heading">
              <div>
                <h2 id="admin-report-details-title">פרטי הדיווח</h2>
                <p>מידע מלא על הדיווח במערכת</p>
              </div>

              <button
                className="admin-reports-close-button"
                onClick={closeDetailsModal}
                aria-label="סגירה"
              >
                ×
              </button>
            </div>

            <div className="admin-reports-details-grid">
              <div className="admin-reports-detail-item">
                <span>מזהה דיווח</span>
                <strong>{selectedReport.reportId}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>מזהה משתמש</span>
                <strong>{selectedReport.userId}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>מזהה אירוע ראשי</span>
                <strong>{formatValue(selectedReport.mainEventId)}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>כותרת</span>
                <strong>{selectedReport.title}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>קטגוריה</span>
                <strong>{selectedReport.categoryName || "—"}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>מזהה קטגוריה</span>
                <strong>{selectedReport.categoryId}</strong>
              </div>

              <div className="admin-reports-detail-item admin-report-description">
                <span>תיאור</span>
                <strong>{selectedReport.description || "—"}</strong>
              </div>

              <div className="admin-reports-detail-item admin-report-description">
                <span>כתובת</span>
                <strong>{selectedReport.inputAddress || "—"}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>קו רוחב</span>
                <strong>{selectedReport.latitude}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>קו אורך</span>
                <strong>{selectedReport.longitude}</strong>
              </div>

              <div className="admin-reports-detail-item">
                <span>תאריך יצירה</span>
                <strong>{formatDate(selectedReport.createdAt)}</strong>
              </div>
            </div>

            <div className="admin-reports-images-section">
              <h3>תמונות הדיווח</h3>

              {selectedReport.imageList &&
              selectedReport.imageList.length > 0 ? (
                <div className="admin-reports-images">
                  {selectedReport.imageList.map((image) => (
                    <a
                      key={image.reportImageId}
                      href={getImageUrl(image.imageUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={getImageUrl(image.imageUrl)}
                        alt="תמונת דיווח"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="admin-reports-no-images">
                  לא צורפו תמונות לדיווח
                </p>
              )}
            </div>

            <button
              className="admin-reports-details-close"
              onClick={closeDetailsModal}
            >
              סגירה
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && selectedDeleteReport && (
        <div
          className="admin-reports-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="admin-reports-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-report-delete-title"
          >
            <div className="admin-reports-modal-icon">!</div>

            <h2 id="admin-report-delete-title">מחיקת דיווח</h2>

            <p>
              האם את בטוחה שברצונך למחוק את הדיווח
              <strong> {selectedDeleteReport.title}</strong>?
            </p>

            <p className="admin-reports-delete-warning">
              לא ניתן לשחזר את הדיווח לאחר המחיקה.
            </p>

            {deleteError && (
              <div className="admin-reports-modal-error">
                {deleteError}
              </div>
            )}

            <div className="admin-reports-modal-actions">
              <button
                className="admin-reports-modal-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                ביטול
              </button>

              <button
                className="admin-reports-modal-confirm"
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

export default AdminReports;
