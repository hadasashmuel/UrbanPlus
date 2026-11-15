
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { startNotificationConnection } from "./store/notifications/notificationsConnection";


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
import AdminNotifications from "./components/AdminNotifications";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.users.token);

  // חיבור ל-SignalR עבור התראות בזמן אמת
  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    let connection:
      | Awaited<ReturnType<typeof startNotificationConnection>>
      | null = null;

    startNotificationConnection(token, dispatch)
      .then((newConnection) => {
        if (cancelled) {
          newConnection.stop();
        } else {
          connection = newConnection;
        }
      })
      .catch((error) => {
        console.error("SignalR connection failed:", error);
      });

    return () => {
      cancelled = true;
      connection?.stop();
    };
  }, [token, dispatch]);

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
          <Route path="notifications" element={<AdminNotifications />} />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
