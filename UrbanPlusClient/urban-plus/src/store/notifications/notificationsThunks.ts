
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { NotificationItem } from "./notificationsState";

const API_URL = "https://localhost:7019/api/Notification";

// שליפת ההתראות של המשתמש המחובר
export const fetchMyNotifications = createAsyncThunk<
  NotificationItem[],
  void,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "notifications/fetchMyNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/mine`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "לא ניתן לטעון את ההתראות"
        );
      }

      return (await response.json()) as NotificationItem[];
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// סימון התראה כנקראה
export const markNotificationAsRead = createAsyncThunk<
  number,
  number,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "notifications/markNotificationAsRead",
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${API_URL}/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "סימון ההתראה כנקראה נכשל"
        );
      }

      return notificationId;
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// מחיקת התראה
export const deleteNotification = createAsyncThunk<
  number,
  number,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "notifications/deleteNotification",
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${API_URL}/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "מחיקת ההתראה נכשלה"
        );
      }

      return notificationId;
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// שליחת מיקום המשתמש לשרת ובדיקת אירועים בקרבתו
export const createNearbyNotifications = createAsyncThunk<
  void,
  { latitude: number; longitude: number },
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "notifications/createNearbyNotifications",
  async (location, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/nearby`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "בדיקת האירועים בקרבת המשתמש נכשלה"
        );
      }
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);
// שליפת כל ההתראות למנהל
export const fetchAllNotifications = createAsyncThunk<
  NotificationItem[],
  void,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "notifications/fetchAllNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "טעינת כל ההתראות נכשלה"
        );
      }

      return (await response.json()) as NotificationItem[];
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);