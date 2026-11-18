
import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  WorkType,
  CreateWorkTypeDTO,
  UpdateWorkTypeDTO,
} from "./workTypesState";

const API_URL = "https://urbanpluspro.premiumasp.net/api/WorkType";

type ThunkConfig = {
  state: { users: { token: string | null } };
  rejectValue: string;
};

// GET - הצגת כל סוגי העבודה
export const fetchWorkTypes = createAsyncThunk<
  WorkType[],
  void,
  ThunkConfig
>(
  "workTypes/fetchWorkTypes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לטעון סוגי עבודה"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// POST - הוספת סוג עבודה
export const createWorkType = createAsyncThunk<
  WorkType,
  CreateWorkTypeDTO,
  ThunkConfig
>(
  "workTypes/createWorkType",
  async (workType, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workType),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן להוסיף סוג עבודה"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// PUT - עדכון סוג עבודה
export const updateWorkType = createAsyncThunk<
  WorkType,
  UpdateWorkTypeDTO,
  ThunkConfig
>(
  "workTypes/updateWorkType",
  async (workType, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(
        `${API_URL}/${workType.workTypeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workType),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לעדכן סוג עבודה"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);
