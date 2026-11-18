
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./serviceProvidersState";

import {
  fetchServiceProviders,
  fetchProvidersForEvent,
  createServiceProvider,
  updateServiceProvider,
} from "./serviceProvidersThunks";

const serviceProvidersSlice = createSlice({
  name: "serviceProviders",
  initialState,

  reducers: {
    clearEventProviders: (state) => {
      state.eventServiceProviders = [];
      state.loadingEventProviders = false;
      state.eventProvidersError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET - כל הספקים
      .addCase(fetchServiceProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceProviders = action.payload;
      })
      .addCase(fetchServiceProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בטעינת הספקים";
      })

      // GET - ספקים המתאימים לאירוע
      .addCase(fetchProvidersForEvent.pending, (state) => {
        state.loadingEventProviders = true;
        state.eventProvidersError = null;
        state.eventServiceProviders = [];
      })
      .addCase(fetchProvidersForEvent.fulfilled, (state, action) => {
        state.loadingEventProviders = false;
        state.eventServiceProviders = action.payload;
      })
      .addCase(fetchProvidersForEvent.rejected, (state, action) => {
        state.loadingEventProviders = false;
        state.eventProvidersError =
          action.payload || "שגיאה בטעינת ספקים מתאימים";
      })

      // POST
      .addCase(createServiceProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceProviders.push(action.payload);
      })
      .addCase(createServiceProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בהוספת ספק";
      })

      // PUT
      .addCase(updateServiceProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceProvider.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.serviceProviders.findIndex(
          (provider) =>
            provider.providerId === action.payload.providerId
        );

        if (index !== -1) {
          state.serviceProviders[index] = action.payload;
        }
      })
      .addCase(updateServiceProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בעדכון ספק";
      });
  },
});

export const { clearEventProviders } = serviceProvidersSlice.actions;

export default serviceProvidersSlice.reducer;
