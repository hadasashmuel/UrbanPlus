import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./users/usersSlice";
import categoriesReducer from "./categories/categoriesSlice";
import reportsReducer from "./reports/reportsSlice";
import aiChatReducer from "./AIChat/aiChatSlice";
import eventsReducer from "./events/eventsSlice";
import badgesReducer from "./badges/badgesSlice";
import notificationsReducer from "./notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    reports: reportsReducer,
    aiChat: aiChatReducer,
    events: eventsReducer,
    badges: badgesReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
