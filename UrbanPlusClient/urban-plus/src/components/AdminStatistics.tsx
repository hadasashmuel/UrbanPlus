
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllReports } from "../store/reports/reportsThunks";

import "./AdminStatistics.css";

function AdminStatistics() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.users.token);
  const reports = useAppSelector((state) => state.reports.allReports);
  const loading = useAppSelector((state) => state.reports.loading);
  const error = useAppSelector((state) => state.reports.error);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllReports());
    }
  }, [dispatch, token]);

  const statistics = useMemo(() => {
    const now = new Date();

    const thisMonthReports = reports.filter((report) => {
      const date = new Date(report.createdAt);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    const categoryCounts: Record<string, number> = {};

    reports.forEach((report) => {
      const category = report.categoryName || "ללא קטגוריה";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const leadingCategory = categoryData[0]?.name || "אין נתונים";

    const monthlyData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - 5 + index,
        1
      );

      const month = date.getMonth();
      const year = date.getFullYear();

      const count = reports.filter((report) => {
        const reportDate = new Date(report.createdAt);

        return (
          reportDate.getMonth() === month &&
          reportDate.getFullYear() === year
        );
      }).length;

      return {
        month: date.toLocaleDateString("he-IL", {
          month: "short",
          year: "2-digit",
        }),
        count,
      };
    });

    return {
      totalReports: reports.length,
      thisMonthReports: thisMonthReports.length,
      leadingCategory,
      categoryData,
      monthlyData,
    };
  }, [reports]);

  if (!token) {
    return (
      <div className="admin-statistics-page">
        <div className="admin-statistics-message">
          <h2>נדרשת התחברות למערכת</h2>
          <button onClick={() => navigate("/login")}>
            להתחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-statistics-page">
      <header className="admin-statistics-header">
        <div>
          <h1>סטטיסטיקות דיווחים</h1>
          <p>ניתוח נתוני הדיווחים שהתקבלו במערכת URBAN+</p>
        </div>
      </header>

      {loading ? (
        <div className="admin-statistics-message">
          <div className="admin-statistics-loader" />
          <p>טוען נתונים...</p>
        </div>
      ) : error ? (
        <div className="admin-statistics-error">
          <p>{error}</p>
          <button onClick={() => dispatch(fetchAllReports())}>
            נסי שוב
          </button>
        </div>
      ) : (
        <>
          <section className="admin-statistics-cards">
            <div className="admin-statistics-card">
              <div className="admin-statistics-card-icon">▤</div>
              <div>
                <span>סך כל הדיווחים</span>
                <strong>{statistics.totalReports}</strong>
              </div>
            </div>

            <div className="admin-statistics-card">
              <div className="admin-statistics-card-icon">▦</div>
              <div>
                <span>דיווחים החודש</span>
                <strong>{statistics.thisMonthReports}</strong>
              </div>
            </div>

            <div className="admin-statistics-card">
              <div className="admin-statistics-card-icon">▥</div>
              <div>
                <span>הקטגוריה המובילה</span>
                <strong className="admin-statistics-category-name">
                  {statistics.leadingCategory}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-statistics-charts">
            <div className="admin-statistics-chart-card">
              <div className="admin-statistics-chart-heading">
                <h2>דיווחים לפי קטגוריה</h2>
                <p>התפלגות הדיווחים בין הקטגוריות השונות</p>
              </div>

              {statistics.categoryData.length === 0 ? (
                <div className="admin-statistics-empty">
                  עדיין אין נתונים להצגה
                </div>
              ) : (
                <div className="admin-statistics-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statistics.categoryData}
                      margin={{
                        top: 15,
                        right: 15,
                        left: 0,
                        bottom: 45,
                      }}
                    >
                      <CartesianGrid
                        stroke="#e5e7eb"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        angle={-25}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={{ stroke: "#d1d5db" }}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#ffffff",
                          color: "#374151",
                        }}
                        formatter={(value) => [value, "מספר דיווחים"]}
                      />

                      <Bar
                        dataKey="count"
                        fill="#6b7280"
                        radius={[6, 6, 0, 0]}
                        name="דיווחים"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="admin-statistics-chart-card">
              <div className="admin-statistics-chart-heading">
                <h2>דיווחים לאורך זמן</h2>
                <p>כמות הדיווחים בששת החודשים האחרונים</p>
              </div>

              <div className="admin-statistics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={statistics.monthlyData}
                    margin={{
                      top: 15,
                      right: 15,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={{ stroke: "#d1d5db" }}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                      }}
                      formatter={(value) => [value, "מספר דיווחים"]}
                    />

                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#4b5563"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#4b5563",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 7, fill: "#1f2937" }}
                      name="דיווחים"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminStatistics;
