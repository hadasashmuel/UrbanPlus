
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ServiceProvider } from "./serviceProvidersState";

const API_URL = "https://urbanpluspro.premiumasp.net/api/ServiceProvider";

export interface CreateServiceProviderDTO {
  fullName: string;
  department: string | null;
  phone: string | null;
  email: string | null;
}

export interface UpdateServiceProviderDTO
  extends CreateServiceProviderDTO {
  providerId: number;
  isActive: boolean;
}

// GET - הצגת כל הספקים
export const fetchServiceProviders = createAsyncThunk<
  ServiceProvider[],
  void,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "serviceProviders/fetchServiceProviders",
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
          (await response.text()) || "לא ניתן לטעון את הספקים"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// GET - הצגת ספקים המתאימים לאירוע מסוים
export const fetchProvidersForEvent = createAsyncThunk<
  ServiceProvider[],
  number,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "serviceProviders/fetchProvidersForEvent",
  async (eventId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(
        `${API_URL}/by-event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לטעון ספקים מתאימים"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// POST - הוספת ספק
export const createServiceProvider = createAsyncThunk<
  ServiceProvider,
  CreateServiceProviderDTO,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "serviceProviders/createServiceProvider",
  async (providerData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerData),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן להוסיף ספק"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);

// PUT - עדכון ספק
export const updateServiceProvider = createAsyncThunk<
  ServiceProvider,
  UpdateServiceProviderDTO,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "serviceProviders/updateServiceProvider",
  async (providerData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) return rejectWithValue("אין משתמש מחובר");

      const response = await fetch(
        `${API_URL}/${providerData.providerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(providerData),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "לא ניתן לעדכן ספק"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("שגיאה בהתחברות לשרת");
    }
  }
);
