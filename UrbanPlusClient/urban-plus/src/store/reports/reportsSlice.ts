
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./reportsState";
import {
  fetchMyReports,
  createReport,
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
