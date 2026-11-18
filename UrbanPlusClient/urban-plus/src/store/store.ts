import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./users/usersSlice";
import categoriesReducer from "./categories/categoriesSlice";
import reportsReducer from "./reports/reportsSlice";
import aiChatReducer from "./AIChat/aiChatSlice";
import eventsReducer from "./events/eventsSlice";
import badgesReducer from "./badges/badgesSlice";
import notificationsReducer from "./notifications/notificationsSlice";
import serviceProvidersReducer from "./serviceProviders/serviceProvidersSlice";
import workTypesReducer from "./workTypes/workTypesSlice";
import providerWorkTypesReducer from "./providerWorkTypes/providerWorkTypesSlice";
import reportAssignmentsReducer from "./reportAssignments/reportAssignmentsSlice";
import locationReducer from "./location/locationSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    reports: reportsReducer,
    aiChat: aiChatReducer,
    events: eventsReducer,
    badges: badgesReducer,
    notifications: notificationsReducer,
    serviceProviders: serviceProvidersReducer,
    workTypes: workTypesReducer,
    providerWorkTypes: providerWorkTypesReducer,
    reportAssignments: reportAssignmentsReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
