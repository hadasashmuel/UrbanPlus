
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { MainEvent, SavedEvent, Vote } from "./eventsState";

const MAIN_EVENT_API = "https://localhost:7019/api/MainEvent";
const SAVE_EVENT_API = "https://localhost:7019/api/SaveEvent";
const VOTE_API = "https://localhost:7019/api/Vote";

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
