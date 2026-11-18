
import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  ProviderWorkType,
  CreateProviderWorkTypeDTO,
} from "./providerWorkTypesState";

const API_URL = "https://urbanpluspro.premiumasp.net/api/ProviderWorkType";

type ThunkConfig = {
  state: { users: { token: string | null } };
  rejectValue: string;
};

// GET - שליפת כל השיוכים
export const fetchProviderWorkTypes = createAsyncThunk<
  ProviderWorkType[],
  void,
  ThunkConfig
>(
  "providerWorkTypes/fetchProviderWorkTypes",
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
          (await response.text()) || "לא ניתן לטעון שיוכים"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// GET - שליפת השיוכים של נותן שירות מסוים
export const fetchProviderWorkTypesByProvider = createAsyncThunk<
  ProviderWorkType[],
  number,
  ThunkConfig
>(
  "providerWorkTypes/fetchProviderWorkTypesByProvider",
  async (providerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(
        `${API_URL}/ByProvider/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לטעון שיוכים לנותן השירות"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// POST - הוספת שיוך
export const createProviderWorkType = createAsyncThunk<
  ProviderWorkType,
  CreateProviderWorkTypeDTO,
  ThunkConfig
>(
  "providerWorkTypes/createProviderWorkType",
  async (providerWorkType, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerWorkType),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן להוסיף שיוך"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// DELETE - מחיקת שיוך
export const deleteProviderWorkType = createAsyncThunk<
  number,
  number,
  ThunkConfig
>(
  "providerWorkTypes/deleteProviderWorkType",
  async (providerWorkTypesId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(
        `${API_URL}/${providerWorkTypesId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן למחוק שיוך"
        );
      }

      return providerWorkTypesId;
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);
