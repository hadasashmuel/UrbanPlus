
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users/usersSlice";
import categoriesReducer from "./categories/categoriesSlice";
import reportsReducer from "./reports/reportsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
