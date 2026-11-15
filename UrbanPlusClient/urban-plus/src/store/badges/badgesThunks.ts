import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Badge } from "./badgesState";

const API_URL = "https://localhost:7019/api/Badge";

// שליפת כל התגים
export const fetchBadges = createAsyncThunk<
  Badge[],
  string,
  { rejectValue: string }
>("badges/fetchBadges", async (token, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("שגיאה בשליפת התגים");
    }

    return await response.json();
  } catch {
    return rejectWithValue("לא ניתן להתחבר לשרת");
  }
});

// מחיקת תג
export const deleteBadge = createAsyncThunk<
  number,
  { id: number; token: string },
  { rejectValue: string }
>("badges/deleteBadge", async ({ id, token }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue("שגיאה במחיקת התג");
    }

    return id;
  } catch {
    return rejectWithValue("לא ניתן להתחבר לשרת");
  }
});