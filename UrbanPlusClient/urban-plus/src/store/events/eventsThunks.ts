
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  MainEvent,
  SavedEvent,
  Vote,
  Message,
} from "./eventsState";

const MAIN_EVENT_API = "https://urbanpluspro.premiumasp.net/api/MainEvent";
const SAVE_EVENT_API = "https://urbanpluspro.premiumasp.net/api/SaveEvent";
const VOTE_API = "https://urbanpluspro.premiumasp.net/api/Vote";
const MESSAGE_API = "https://urbanpluspro.premiumasp.net/api/Message";

interface ThunkConfig {
  state: {
    users: {
      token: string | null;
    };
  };
  rejectValue: string;
}

// נתונים ליצירת הצבעה
export interface CreateVoteRequest {
  mainEventId: number;
  typeVote: number;
}

// נתונים למחיקת אירוע
export interface DeleteMainEventRequest {
  mainEventId: number;
  reason: string;
}

// נתונים לעדכון אירוע
export interface UpdateMainEventRequest {
  mainEventId: number;
  categoryId: number;
  title: string;
  status: number;
  severity: number;
  estimatedResolutionMinutes: number;
}

// =====================================
//              אירועים
// =====================================

// שליפת כל האירועים
export const fetchMainEvents = createAsyncThunk<
  MainEvent[],
  void,
  { rejectValue: string }
>(
  "events/fetchMainEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(MAIN_EVENT_API);

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load events"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// =====================================
//          הודעות באירועים
// =====================================

// שליפת הודעות לפי מזהה אירוע
export const fetchEventMessages = createAsyncThunk<
  Message[],
  number,
  ThunkConfig
>(
  "events/fetchEventMessages",
  async (mainEventId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${MESSAGE_API}/event/${mainEventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load event messages"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// =====================================
//          אירועים שמורים
// =====================================

// שליפת האירועים שהמשתמש שמר
export const fetchSavedEvents = createAsyncThunk<
  SavedEvent[],
  void,
  ThunkConfig
>(
  "events/fetchSavedEvents",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${SAVE_EVENT_API}/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load saved events"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// שמירת אירוע
export const saveEvent = createAsyncThunk<
  SavedEvent,
  number,
  ThunkConfig
>(
  "events/saveEvent",
  async (mainEventId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(SAVE_EVENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mainEventId,
        }),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to save event"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// ביטול שמירת אירוע
export const deleteSavedEvent = createAsyncThunk<
  number,
  number,
  ThunkConfig
>(
  "events/deleteSavedEvent",
  async (savedEventId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${SAVE_EVENT_API}/${savedEventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to delete saved event"
        );
      }

      return savedEventId;
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// =====================================
//              הצבעות
// =====================================

// שליפת ההצבעות של המשתמש המחובר
export const fetchMyVotes = createAsyncThunk<
  Vote[],
  void,
  ThunkConfig
>(
  "events/fetchMyVotes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${VOTE_API}/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to load votes"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// יצירת הצבעה
export const createVote = createAsyncThunk<
  Vote,
  CreateVoteRequest,
  ThunkConfig
>(
  "events/createVote",
  async (voteData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(VOTE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mainEventId: voteData.mainEventId,
          typeVote: voteData.typeVote,
        }),
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to create vote"
        );
      }

      return await response.json();
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// ביטול הצבעה
export const deleteVote = createAsyncThunk<
  number,
  number,
  ThunkConfig
>(
  "events/deleteVote",
  async (voteId, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${VOTE_API}/${voteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to delete vote"
        );
      }

      return voteId;
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// =====================================
//          ניהול אירועים – מנהל
// =====================================

// עדכון אירוע
export const updateMainEvent = createAsyncThunk<
  UpdateMainEventRequest,
  UpdateMainEventRequest,
  ThunkConfig
>(
  "events/updateMainEvent",
  async (eventData, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${MAIN_EVENT_API}/admin/${eventData.mainEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryId: eventData.categoryId,
            title: eventData.title,
            status: eventData.status,
            severity: eventData.severity,
            estimatedResolutionMinutes:
              eventData.estimatedResolutionMinutes,
          }),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to update event"
        );
      }

      // רענון הרשימה כדי לקבל גם את שם הקטגוריה המעודכן
      dispatch(fetchMainEvents());

      return eventData;
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);

// מחיקת אירוע
export const deleteMainEvent = createAsyncThunk<
  number,
  DeleteMainEventRequest,
  ThunkConfig
>(
  "events/deleteMainEvent",
  async ({ mainEventId, reason }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(
        `${MAIN_EVENT_API}/admin/${mainEventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          (await response.text()) || "Failed to delete event"
        );
      }

      return mainEventId;
    } catch {
      return rejectWithValue("Could not connect to server");
    }
  }
);
