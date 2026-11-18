
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ReportAssignment,
  CreateReportAssignmentDTO,
} from "./reportAssignmentsState";

const API_URL = "https://urbanpluspro.premiumasp.net/api/ReportAssignment";

// שליפת כל השיוכים
export const fetchReportAssignments = createAsyncThunk<
  ReportAssignment[],
  void,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reportAssignments/fetchReportAssignments",
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
          errorMessage || "לא ניתן לטעון את השיוכים"
        );
      }

      return (await response.json()) as ReportAssignment[];
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// שליפת השיוך הנוכחי של דיווח
export const fetchCurrentAssignment = createAsyncThunk<
  ReportAssignment | null,
  number,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reportAssignments/fetchCurrentAssignment",
  async (reportId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${API_URL}/Report/${reportId}/Current`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "לא ניתן לטעון את השיוך הנוכחי"
        );
      }

      return (await response.json()) as ReportAssignment;
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// שליפת היסטוריית השיוכים של דיווח
export const fetchAssignmentHistory = createAsyncThunk<
  ReportAssignment[],
  number,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reportAssignments/fetchAssignmentHistory",
  async (reportId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${API_URL}/Report/${reportId}/History`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "לא ניתן לטעון את היסטוריית השיוכים"
        );
      }

      return (await response.json()) as ReportAssignment[];
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

// שיוך ספק לדיווח
export const createReportAssignment = createAsyncThunk<
  ReportAssignment,
  CreateReportAssignmentDTO,
  {
    state: { users: { token: string | null } };
    rejectValue: string;
  }
>(
  "reportAssignments/createReportAssignment",
  async (assignmentData, { getState, rejectWithValue }) => {
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
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(
          errorMessage || "שיוך הספק לדיווח נכשל"
        );
      }

      return (await response.json()) as ReportAssignment;
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);
