
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Category } from "./categoriesState";

const API_URL = "https://localhost:7019/api/Category";

// שליפת כל הקטגוריות
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load categories"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// שליפת קטגוריה לפי מזהה
export const fetchCategoryById = createAsyncThunk<
  Category,
  number,
  { rejectValue: string }
>(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load category"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// יצירת קטגוריה
interface CreateCategoryRequest {
  categoryName: string;
  categoryDescription: string;
}

export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryRequest,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "categories/createCategory",
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to create category"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// מחיקת קטגוריה
export const deleteCategory = createAsyncThunk<
  number,
  number,
  { state: { users: { token: string | null } }; rejectValue: string }
>(
  "categories/deleteCategory",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to delete category"
        );
      }

      return id;
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);
