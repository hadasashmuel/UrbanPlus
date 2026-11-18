
import { createSlice } from "@reduxjs/toolkit";

import {
  initialState,
} from "./reportAssignmentsState";

import {
  fetchReportAssignments,
  fetchCurrentAssignment,
  fetchAssignmentHistory,
  createReportAssignment,
} from "./reportAssignmentsThunks";

const reportAssignmentsSlice = createSlice({
  name: "reportAssignments",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // שליפת כל השיוכים
      .addCase(fetchReportAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchReportAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "טעינת השיוכים נכשלה";
      })

      // שליפת שיוך נוכחי
      .addCase(fetchCurrentAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentAssignment.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const index = state.assignments.findIndex(
            (item) =>
              item.assignmentId === action.payload!.assignmentId
          );

          if (index >= 0) {
            state.assignments[index] = action.payload;
          } else {
            state.assignments.push(action.payload);
          }
        }
      })
      .addCase(fetchCurrentAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "טעינת השיוך הנוכחי נכשלה";
      })

      // שליפת היסטוריית שיוכים
      .addCase(fetchAssignmentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentHistory.fulfilled, (state, action) => {
        state.loading = false;

        const reportId = action.meta.arg;

        state.assignments = [
          ...state.assignments.filter(
            (item) => item.reportId !== reportId
          ),
          ...action.payload,
        ];
      })
      .addCase(fetchAssignmentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "טעינת היסטוריית השיוכים נכשלה";
      })

      // יצירת שיוך חדש
      .addCase(createReportAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReportAssignment.fulfilled, (state, action) => {
        state.loading = false;

        const newAssignment = action.payload;

        state.assignments = state.assignments.map((item) =>
          item.reportId === newAssignment.reportId && item.isCurrent
            ? { ...item, isCurrent: false }
            : item
        );

        state.assignments.push(newAssignment);
      })
      .addCase(createReportAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שיוך הספק נכשל";
      });
  },
});

export default reportAssignmentsSlice.reducer;
