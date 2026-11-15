
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  fetchMyNotifications,
  fetchAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "./notificationsThunks";

import {
  initialState,
  type NotificationItem,
} from "./notificationsState";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    // קבלת התראה חדשה בזמן אמת דרך SignalR
    addRealtimeNotification: (
      state,
      action: PayloadAction<NotificationItem>
    ) => {
      const notification = action.payload;

      const exists = state.notifications.some(
        (item) =>
          item.notificationId === notification.notificationId
      );

      if (!exists) {
        state.notifications.unshift(notification);
      }

      // עדכון גם ברשימת התראות המנהל
      const adminExists = state.adminNotifications.some(
        (item) =>
          item.notificationId === notification.notificationId
      );

      if (!adminExists) {
        state.adminNotifications.unshift(notification);
      }

      state.realtimeNotification = notification;
    },

    // ניקוי ההתראה המוצגת למשתמש
    clearRealtimeNotification: (state) => {
      state.realtimeNotification = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // =====================================
      // שליפת ההתראות של המשתמש המחובר
      // =====================================
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchMyNotifications.fulfilled,
        (state, action) => {
          state.loading = false;
          state.notifications = action.payload;
        }
      )

      .addCase(
        fetchMyNotifications.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ?? "טעינת ההתראות נכשלה";
        }
      )

      // =====================================
      // שליפת כל ההתראות למנהל
      // =====================================
      .addCase(fetchAllNotifications.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })

      .addCase(
        fetchAllNotifications.fulfilled,
        (state, action) => {
          state.adminLoading = false;
          state.adminNotifications = action.payload;
        }
      )

      .addCase(
        fetchAllNotifications.rejected,
        (state, action) => {
          state.adminLoading = false;
          state.adminError =
            action.payload ?? "טעינת כל ההתראות נכשלה";
        }
      )

      // =====================================
      // סימון התראה כנקראה
      // =====================================
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action) => {
          const notification = state.notifications.find(
            (item) =>
              item.notificationId === action.payload
          );

          if (notification) {
            notification.isRead = true;
          }

          const adminNotification =
            state.adminNotifications.find(
              (item) =>
                item.notificationId === action.payload
            );

          if (adminNotification) {
            adminNotification.isRead = true;
          }
        }
      )

      // =====================================
      // מחיקת התראה
      // =====================================
      .addCase(
        deleteNotification.fulfilled,
        (state, action) => {
          state.notifications = state.notifications.filter(
            (item) =>
              item.notificationId !== action.payload
          );

          state.adminNotifications =
            state.adminNotifications.filter(
              (item) =>
                item.notificationId !== action.payload
            );
        }
      );
  },
});

export const {
  addRealtimeNotification,
  clearRealtimeNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
