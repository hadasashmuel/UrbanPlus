
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Report } from "./reportsState";

const API_URL = "https://localhost:7019/api/Report/MyReports";
const REPORT_API_URL = "https://localhost:7019/api/Report";

interface CreateReportRequest {
  categoryId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  inputAddress: string;
  images: File[];
}

// שליפת הדיווחים של המשתמש המחובר
export const fetchMyReports = createAsyncThunk<
  Report[],
  void,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reports/fetchMyReports",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "לא ניתן לטעון את הדיווחים"
        );
      }

      return (await response.json()) as Report[];
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// יצירת דיווח חדש כולל תמונות
export const createReport = createAsyncThunk<
  Report,
  CreateReportRequest,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reports/createReport",
  async (reportData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const formData = new FormData();

      formData.append("CategoryId", String(reportData.categoryId));
      formData.append("Title", reportData.title);
      formData.append("Description", reportData.description);
      formData.append("Latitude", String(reportData.latitude));
      formData.append("Longitude", String(reportData.longitude));
      formData.append("InputAddress", reportData.inputAddress);

      reportData.images.forEach((image, index) => {
        formData.append(`ImageList[${index}].ImageUrl`, image);
      });

      const response = await fetch(REPORT_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        return rejectWithValue(
          errorMessage || "יצירת הדיווח נכשלה"
        );
      }

      return (await response.json()) as Report;
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);
