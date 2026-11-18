
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UpdateUser from "./components/UpdateUser";
import Profile from "./components/Profile";
import ActiveEvents from "./components/ActiveEvents";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminEvents from "./components/AdminEvents";
import AdminCategories from "./components/AdminCategories";
import AdminBadges from "./components/AdminBadges";
import AdminReports from "./components/AdminReports";
import AdminStatistics from "./components/AdminStatistics";
import AdminNotifications from "./components/AdminNotifications";
import AdminServiceProviders from "./components/AdminServiceProviders";
import AdminWorkTypes from "./components/AdminWorkTypes";
import AdminProviderWorkTypes from "./components/AdminProviderWorkTypes";
import AdminReportAssignments from "./components/AdminReportAssignments";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* דף הבית והתחברות */}
        <Route path="/" element={<Home />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* עמודים רגילים */}
        <Route path="/update-user" element={<UpdateUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/active-events" element={<ActiveEvents />} />

        {/* אזור ניהול */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="badges" element={<AdminBadges />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="notifications" element={<AdminNotifications />} />

          <Route
            path="service-providers"
            element={<AdminServiceProviders />}
          />

          <Route
            path="work-types"
            element={<AdminWorkTypes />}
          />
          <Route
           path="provider-work-types"
           element={<AdminProviderWorkTypes />}
           />
           <Route
            path="report-assignments"
           element={<AdminReportAssignments />}
           />
        </Route>

        {/* נתיב לא מוכר */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
