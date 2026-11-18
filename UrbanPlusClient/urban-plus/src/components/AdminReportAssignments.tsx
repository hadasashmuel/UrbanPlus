
import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { fetchAllReports } from "../store/reports/reportsThunks";
import { fetchServiceProviders } from "../store/serviceProviders/serviceProvidersThunks";
import { fetchWorkTypes } from "../store/workTypes/workTypesThunks";
import { fetchProviderWorkTypes } from "../store/providerWorkTypes/providerWorkTypesThunks";

import {
  fetchReportAssignments,
  createReportAssignment,
  fetchAssignmentHistory,
} from "../store/reportAssignments/reportAssignmentsThunks";

import type { Report } from "../store/reports/reportsState";
import type { ReportAssignment } from "../store/reportAssignments/reportAssignmentsState";

import "./AdminReportAssignments.css";

function AdminReportAssignments() {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.users.token);

  const reports = useAppSelector((state) => state.reports.allReports);

  const providers = useAppSelector(
    (state) => state.serviceProviders.serviceProviders
  );

  const workTypes = useAppSelector(
    (state) => state.workTypes.workTypes
  );

  const providerWorkTypes = useAppSelector(
    (state) => state.providerWorkTypes.providerWorkTypes
  );

  const assignments = useAppSelector(
    (state) => state.reportAssignments.assignments
  );

  const loading = useAppSelector(
    (state) => state.reportAssignments.loading
  );

  const error = useAppSelector(
    (state) => state.reportAssignments.error
  );

  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [historyReport, setHistoryReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<ReportAssignment[]>([]);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (!token) return;

    dispatch(fetchAllReports());
    dispatch(fetchServiceProviders());
    dispatch(fetchWorkTypes());
    dispatch(fetchProviderWorkTypes());
    dispatch(fetchReportAssignments());
  }, [dispatch, token]);

  const currentAssignments = useMemo(
    () => assignments.filter((item) => item.isCurrent),
    [assignments]
  );

  const filteredReports = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return reports;

    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(value) ||
        report.categoryName.toLowerCase().includes(value) ||
        report.inputAddress.toLowerCase().includes(value) ||
        String(report.reportId).includes(value)
    );
  }, [reports, search]);

  const getCurrentAssignment = (reportId: number) =>
    currentAssignments.find((item) => item.reportId === reportId);

  // קבלת סוגי העבודה המשויכים לספק
  const getProviderWorkTypes = (providerId: number) => {
    const providerWorkTypeIds = new Set<number>(
      providerWorkTypes
        .filter((item) => item.providerId === providerId)
        .map((item) => item.workTypeId)
    );

    return workTypes.filter((workType) =>
      providerWorkTypeIds.has(workType.workTypeId)
    );
  };

  const handleAssign = async () => {
    if (!selectedReport || !selectedProviderId) {
      setModalError("יש לבחור ספק שירות");
      return;
    }

    setSaving(true);
    setModalError("");

    try {
      await dispatch(
        createReportAssignment({
          reportId: selectedReport.reportId,
          providerId: Number(selectedProviderId),
        })
      ).unwrap();

      setSelectedReport(null);
      setSelectedProviderId("");

      await dispatch(fetchReportAssignments()).unwrap();

      alert("הספק שויך לדיווח בהצלחה!");
    } catch (err) {
      setModalError(
        typeof err === "string" ? err : "שיוך הספק נכשל"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleHistory = async (report: Report) => {
    setHistoryReport(report);
    setHistory([]);
    setModalError("");

    try {
      const result = await dispatch(
        fetchAssignmentHistory(report.reportId)
      ).unwrap();

      setHistory(result);
    } catch {
      setModalError("לא ניתן לטעון את היסטוריית השיוכים");
    }
  };

  const closeAssignModal = () => {
    setSelectedReport(null);
    setSelectedProviderId("");
    setModalError("");
  };

  const selectedProvider = providers.find(
    (provider) => provider.providerId === Number(selectedProviderId)
  );

  const selectedProviderWorkTypes = selectedProviderId
    ? getProviderWorkTypes(Number(selectedProviderId))
    : [];

  return (
    <div className="admin-report-assignments-page">
      <div className="admin-report-assignments-content">

        <div className="admin-report-assignments-header">
          <div>
            <h1>שיוך ספקים לדיווחים</h1>
            <p>ניהול והקצאת דיווחים לספקי השירות העירוניים</p>
          </div>
        </div>

        <div className="admin-report-assignments-summary">
          <div className="admin-report-assignments-summary-icon">
            🔗
          </div>

          <div>
            <span>סה״כ דיווחים</span>
            <strong>{reports.length}</strong>
          </div>
        </div>

        <div className="admin-report-assignments-summary">
          <div className="admin-report-assignments-summary-icon">
            🏢
          </div>

          <div>
            <span>דיווחים משויכים</span>
            <strong>{currentAssignments.length}</strong>
          </div>
        </div>

        <div className="admin-report-assignments-summary">
          <div className="admin-report-assignments-summary-icon">
            📋
          </div>

          <div>
            <span>דיווחים ללא שיוך</span>
            <strong>
              {reports.filter(
                (report) => !getCurrentAssignment(report.reportId)
              ).length}
            </strong>
          </div>
        </div>

        <div className="admin-report-assignments-card">

          <div className="admin-report-assignments-toolbar">
            <div>
              <h2>רשימת דיווחים</h2>
              <p>בחירת ספק שירות מתאים לכל דיווח</p>
            </div>

            <div className="admin-report-assignments-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="חיפוש לפי דיווח, קטגוריה או כתובת..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading && reports.length === 0 ? (
            <div className="admin-report-assignments-message">
              <div className="admin-report-assignments-loader" />
              טוען נתונים...
            </div>
          ) : error && reports.length === 0 ? (
            <div className="admin-report-assignments-error">
              {error}
              <button
                onClick={() => {
                  dispatch(fetchAllReports());
                  dispatch(fetchReportAssignments());
                }}
              >
                נסה שוב
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="admin-report-assignments-empty">
              <span>📭</span>
              <h3>לא נמצאו דיווחים</h3>
              <p>לא נמצאו דיווחים התואמים לחיפוש</p>
            </div>
          ) : (
            <div className="admin-report-assignments-table-wrapper">
              <table className="admin-report-assignments-table">
                <thead>
                  <tr>
                    <th>מספר דיווח</th>
                    <th>כותרת</th>
                    <th>קטגוריה</th>
                    <th>כתובת</th>
                    <th>ספק משויך</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => {
                    const assignment = getCurrentAssignment(
                      report.reportId
                    );

                    return (
                      <tr key={report.reportId}>
                        <td>{report.reportId}</td>

                        <td>
                          <strong>{report.title}</strong>
                        </td>

                        <td>
                          <span className="admin-report-assignment-category">
                            {report.categoryName}
                          </span>
                        </td>

                        <td className="admin-report-assignment-address">
                          {report.inputAddress}
                        </td>

                        <td>
                          {assignment ? (
                            assignment.providerName
                          ) : (
                            <span className="admin-report-assignment-none">
                              טרם שויך
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={
                              assignment
                                ? "admin-report-assignment-status assigned"
                                : "admin-report-assignment-status unassigned"
                            }
                          >
                            {assignment ? "משויך" : "ממתין לשיוך"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-report-assignment-actions">
                            <button
                              className="admin-report-assignment-button"
                              onClick={() => {
                                setSelectedReport(report);
                                setSelectedProviderId("");
                                setModalError("");
                              }}
                            >
                              {assignment ? "החלף ספק" : "שייך ספק"}
                            </button>

                            <button
                              className="admin-report-assignment-history-button"
                              onClick={() => handleHistory(report)}
                            >
                              היסטוריה
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-report-assignments-footer">
            מציג {filteredReports.length} מתוך {reports.length} דיווחים
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="admin-report-assignment-overlay">
          <div className="admin-report-assignment-modal">

            <div className="admin-report-assignment-modal-heading">
              <div>
                <h2>שיוך ספק לדיווח</h2>
                <p>דיווח מספר {selectedReport.reportId}</p>
              </div>

              <button
                className="admin-report-assignment-close"
                onClick={closeAssignModal}
              >
                ×
              </button>
            </div>

            <div className="admin-report-assignment-report-info">
              <strong>{selectedReport.title}</strong>
              <span>{selectedReport.categoryName}</span>
              <span>{selectedReport.inputAddress}</span>
            </div>

            <label>בחירת ספק שירות</label>

            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
            >
              <option value="">בחרי ספק שירות</option>

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

            {selectedProvider && (
              <div className="admin-report-assignment-provider-info">
                <strong>{selectedProvider.fullName}</strong>

                <span>
                  {selectedProvider.department || "ללא מחלקה"}
                </span>

                <span>
                  {selectedProvider.phone || "ללא טלפון"}
                </span>

                <div className="admin-report-assignment-work-types">
                  <strong>סוגי עבודה של הספק:</strong>

                  {selectedProviderWorkTypes.length > 0 ? (
                    <ul>
                      {selectedProviderWorkTypes.map((workType) => (
                        <li key={workType.workTypeId}>
                          {workType.nameWorkTypes}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>לא הוגדרו לספק סוגי עבודה</span>
                  )}
                </div>
              </div>
            )}

            {modalError && (
              <div className="admin-report-assignment-modal-error">
                {modalError}
              </div>
            )}

            <div className="admin-report-assignment-modal-actions">
              <button
                className="admin-report-assignment-cancel"
                onClick={closeAssignModal}
                disabled={saving}
              >
                ביטול
              </button>

              <button
                className="admin-report-assignment-confirm"
                onClick={handleAssign}
                disabled={saving || !selectedProviderId}
              >
                {saving ? "משייך..." : "אישור שיוך"}
              </button>
            </div>
          </div>
        </div>
      )}

      {historyReport && (
        <div className="admin-report-assignment-overlay">
          <div className="admin-report-assignment-modal">

            <div className="admin-report-assignment-modal-heading">
              <div>
                <h2>היסטוריית שיוכים</h2>
                <p>{historyReport.title}</p>
              </div>

              <button
                className="admin-report-assignment-close"
                onClick={() => {
                  setHistoryReport(null);
                  setHistory([]);
                  setModalError("");
                }}
              >
                ×
              </button>
            </div>

            {modalError ? (
              <div className="admin-report-assignment-modal-error">
                {modalError}
              </div>
            ) : history.length === 0 ? (
              <div className="admin-report-assignments-empty">
                לא קיימת היסטוריית שיוכים לדיווח זה
              </div>
            ) : (
              <div className="admin-report-assignment-history-list">
                {history.map((item) => (
                  <div
                    key={item.assignmentId}
                    className="admin-report-assignment-history-item"
                  >
                    <strong>{item.providerName}</strong>

                    <span>מנהל: {item.managerName}</span>

                    <span>
                      תאריך:{" "}
                      {new Date(item.assignedAt).toLocaleString("he-IL")}
                    </span>

                    <span
                      className={
                        item.isCurrent
                          ? "admin-report-assignment-status assigned"
                          : "admin-report-assignment-status unassigned"
                      }
                    >
                      {item.isCurrent ? "שיוך נוכחי" : "שיוך קודם"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              className="admin-report-assignment-history-close"
              onClick={() => {
                setHistoryReport(null);
                setHistory([]);
                setModalError("");
              }}
            >
              סגירה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReportAssignments;
