import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./badgesState";
import { fetchBadges, deleteBadge } from "./badgesThunks";

const badgesSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // שליפת כל התגים
      .addCase(fetchBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בשליפת התגים";
      })

      // מחיקת תג
      .addCase(deleteBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = state.badges.filter(
          (badge) => badge.badgeId !== action.payload
        );
      })
      .addCase(deleteBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה במחיקת התג";
      });
  },
});

export default badgesSlice.reducer;