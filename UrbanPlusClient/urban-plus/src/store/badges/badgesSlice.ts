
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./badgesState";

import {
  fetchBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from "./badgesThunks";

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

      // הוספת תג
      .addCase(createBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badges.push(action.payload);
      })
      .addCase(createBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בהוספת התג";
      })

      // עדכון תג
      .addCase(updateBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBadge.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.badges.findIndex(
          (badge) => badge.badgeId === action.payload.badgeId
        );

        if (index !== -1) {
          state.badges[index] = action.payload;
        }
      })
      .addCase(updateBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "שגיאה בעדכון התג";
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
