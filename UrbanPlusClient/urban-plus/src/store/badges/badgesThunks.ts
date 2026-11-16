
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

// הוספת תג
export interface CreateBadgeRequest {
  badgeName: string;
  description: string;
  iconUrl: File;
}

export const createBadge = createAsyncThunk<
  Badge,
  { badge: CreateBadgeRequest; token: string },
  { rejectValue: string }
>(
  "badges/createBadge",
  async ({ badge, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("BadgeName", badge.badgeName);
      formData.append("Description", badge.description);
      formData.append("IconUrl", badge.iconUrl);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(
          errorText || "שגיאה בהוספת התג"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// עדכון תג
export interface UpdateBadgeRequest {
  badgeName: string;
  description: string;
  iconUrl?: File | null;
}

export const updateBadge = createAsyncThunk<
  Badge,
  { id: number; badge: UpdateBadgeRequest; token: string },
  { rejectValue: string }
>(
  "badges/updateBadge",
  async ({ id, badge, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("BadgeName", badge.badgeName);
      formData.append("Description", badge.description);

      if (badge.iconUrl) {
        formData.append("IconUrl", badge.iconUrl);
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(
          errorText || "שגיאה בעדכון התג"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

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
