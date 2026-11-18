import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./workTypesState";

import {
  fetchWorkTypes,
  createWorkType,
  updateWorkType,
} from "./workTypesThunks";

const workTypesSlice = createSlice({
  name: "workTypes",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // שליפת כל סוגי העבודה
      .addCase(fetchWorkTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.workTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load work types";
      })

      // הוספת סוג עבודה
      .addCase(createWorkType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkType.fulfilled, (state, action) => {
        state.loading = false;
        state.workTypes.push(action.payload);
        state.error = null;
      })
      .addCase(createWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create work type";
      })

      // עדכון סוג עבודה
      .addCase(updateWorkType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkType.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.workTypes.findIndex(
          (workType) =>
            workType.workTypeId === action.payload.workTypeId
        );

        if (index !== -1) {
          state.workTypes[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(updateWorkType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update work type";
      });
  },
});

export default workTypesSlice.reducer;