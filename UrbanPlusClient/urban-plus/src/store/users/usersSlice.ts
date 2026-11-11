
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./usersState";
import {
  loginUser,
  registerUser,
  fetchMyProfile,
  updateUser,
  googleLoginUser,
} from "./usersThunks";

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // התחברות
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      // התחברות באמצעות Google
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Google login failed";
      })  
      // הרשמה
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      })

      // שליפת פרופיל
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load profile";
      })

      // עדכון פרטים
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "עדכון הפרטים נכשל";
      });
  },
});

export default usersSlice.reducer;
