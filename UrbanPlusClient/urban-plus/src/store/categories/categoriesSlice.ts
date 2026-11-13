
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./categoriesState";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  deleteCategory,
} from "./categoriesThunks";

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // שליפת כל הקטגוריות
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load categories";
      })

      // שליפת קטגוריה לפי מזהה
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;

        const exists = state.categories.some(
          (category) => category.categoryId === action.payload.categoryId
        );

        if (!exists) {
          state.categories.push(action.payload);
        }

        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load category";
      })

      // יצירת קטגוריה
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create category";
      })

      // מחיקת קטגוריה
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category.categoryId !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete category";
      });
  },
});

export default categoriesSlice.reducer;
