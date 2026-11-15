
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AuthResponseUser,
  ProfileUser,
  AdminUser,
} from "./usersState";

const API_URL = "https://localhost:7019/api/User";

// התחברות
interface LoginUserRequest {
  email: string;
  password: string;
  authProvider: number;
}

export const loginUser = createAsyncThunk<
  AuthResponseUser,
  LoginUserRequest,
  { rejectValue: string }
>(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Login failed"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// הרשמה
interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authProvider: number;
  profilePicture?: File | null;
}

export const registerUser = createAsyncThunk<
  string,
  RegisterUserRequest,
  { rejectValue: string }
>(
  "users/register",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("FirstName", userData.firstName);
      formData.append("LastName", userData.lastName);
      formData.append("Email", userData.email);
      formData.append("password", userData.password);
      formData.append("AuthProvider", String(userData.authProvider));

      if (userData.profilePicture) {
        formData.append("ProfilePicture", userData.profilePicture);
      }

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Registration failed"
        );
      }

      return await response.text();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// שליפת פרטי המשתמש המחובר
export const fetchMyProfile = createAsyncThunk<
  ProfileUser,
  void,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "users/fetchMyProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לטעון פרופיל"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// עדכון פרטי המשתמש המחובר
interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  profilePicture?: File | null;
}

export const updateUser = createAsyncThunk<
  ProfileUser,
  UpdateUserRequest,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "users/updateUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const formData = new FormData();

      formData.append("FirstName", userData.firstName);
      formData.append("LastName", userData.lastName);

      if (userData.profilePicture) {
        formData.append("ProfilePicture", userData.profilePicture);
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "עדכון הפרטים נכשל"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// התחברות באמצעות Google
export const googleLoginUser = createAsyncThunk<
  AuthResponseUser,
  string,
  { rejectValue: string }
>(
  "users/googleLogin",
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Google login failed"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// ======================================
// ניהול משתמשים - מנהל מערכת
// ======================================

// שליפת כל המשתמשים
export const fetchAdminUsers = createAsyncThunk<
  AdminUser[],
  void,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "users/fetchAdminUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לטעון את רשימת המשתמשים"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// מחיקת משתמש עם סיבה
interface DeleteAdminUserRequest {
  userId: number;
  reason: string;
}

export const deleteAdminUser = createAsyncThunk<
  number,
  DeleteAdminUserRequest,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "users/deleteAdminUser",
  async ({ userId, reason }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/admin/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "מחיקת המשתמש נכשלה"
        );
      }

      return userId;
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);
