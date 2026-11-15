
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./reportsState";

import {
  fetchMyReports,
  createReport,
  fetchAllReports,
  deleteReport,
} from "./reportsThunks";

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // שליפת הדיווחים שלי
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.myReports = action.payload;
        state.error = null;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "לא ניתן לטעון את הדיווחים";
      })

      // שליפת כל הדיווחים למנהל
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.allReports = action.payload;
        state.error = null;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "לא ניתן לטעון את כל הדיווחים";
      })

      // מחיקת דיווח
      .addCase(deleteReport.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.allReports = state.allReports.filter(
          (report) => report.reportId !== action.payload
        );

        state.myReports = state.myReports.filter(
          (report) => report.reportId !== action.payload
        );
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.error = action.payload ?? "מחיקת הדיווח נכשלה";
      })

      // יצירת דיווח חדש
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.myReports.unshift(action.payload);
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "יצירת הדיווח נכשלה";
      });
  },
});

export default reportsSlice.reducer;
