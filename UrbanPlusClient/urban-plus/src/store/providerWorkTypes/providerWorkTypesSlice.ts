
import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./providerWorkTypesState";

import {
  fetchProviderWorkTypes,
  fetchProviderWorkTypesByProvider,
  createProviderWorkType,
  deleteProviderWorkType,
} from "./providerWorkTypesThunks";

const providerWorkTypesSlice = createSlice({
  name: "providerWorkTypes",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // שליפת כל השיוכים
      .addCase(fetchProviderWorkTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderWorkTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.providerWorkTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchProviderWorkTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load provider work types";
      })

      // שליפת שיוכים לפי נותן שירות
      .addCase(fetchProviderWorkTypesByProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderWorkTypesByProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.providerWorkTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchProviderWorkTypesByProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load provider work types";
      })

      // הוספת שיוך
      .addCase(createProviderWorkType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProviderWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.providerWorkTypes.push(action.payload);
        state.error = null;
      })
      .addCase(createProviderWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create provider work type";
      })

      // מחיקת שיוך
      .addCase(deleteProviderWorkType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProviderWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.providerWorkTypes = state.providerWorkTypes.filter(
          (item) => item.providerWorkTypesId !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteProviderWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete provider work type";
      });
  },
});

export default providerWorkTypesSlice.reducer;
