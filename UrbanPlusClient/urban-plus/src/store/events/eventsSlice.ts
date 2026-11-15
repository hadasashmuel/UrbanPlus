
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./eventsState";

import {
  fetchMainEvents,
  fetchSavedEvents,
  saveEvent,
  deleteSavedEvent,
  fetchMyVotes,
  createVote,
  deleteVote,
  deleteMainEvent,
} from "./eventsThunks";

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // =====================================
      //             אירועים
      // =====================================

      .addCase(fetchMainEvents.pending, (state) => {
        state.loadingMainEvents = true;
        state.error = null;
      })
      .addCase(fetchMainEvents.fulfilled, (state, action) => {
        state.loadingMainEvents = false;
        state.mainEvents = action.payload;
      })
      .addCase(fetchMainEvents.rejected, (state, action) => {
        state.loadingMainEvents = false;
        state.error = action.payload ?? "Failed to load events";
      })

      // =====================================
      //          אירועים שמורים
      // =====================================

      .addCase(fetchSavedEvents.pending, (state) => {
        state.loadingSavedEvents = true;
        state.error = null;
      })
      .addCase(fetchSavedEvents.fulfilled, (state, action) => {
        state.loadingSavedEvents = false;
        state.savedEvents = action.payload;
      })
      .addCase(fetchSavedEvents.rejected, (state, action) => {
        state.loadingSavedEvents = false;
        state.error = action.payload ?? "Failed to load saved events";
      })

      // שמירת אירוע
      .addCase(saveEvent.pending, (state) => {
        state.savingEvent = true;
        state.error = null;
      })
      .addCase(saveEvent.fulfilled, (state, action) => {
        state.savingEvent = false;

        const alreadySaved = state.savedEvents.some(
          (item) =>
            item.mainEventId === action.payload.mainEventId
        );

        if (!alreadySaved) {
          state.savedEvents.push(action.payload);

          const event = state.mainEvents.find(
            (item) =>
              item.mainEventsId === action.payload.mainEventId
          );

          if (event) {
            event.countSavedEvents += 1;
          }
        }
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.savingEvent = false;
        state.error = action.payload ?? "Failed to save event";
      })

      // ביטול שמירת אירוע
      .addCase(deleteSavedEvent.pending, (state) => {
        state.deletingSavedEvent = true;
        state.error = null;
      })
      .addCase(deleteSavedEvent.fulfilled, (state, action) => {
        state.deletingSavedEvent = false;

        const savedEvent = state.savedEvents.find(
          (item) => item.savedEventId === action.payload
        );

        if (savedEvent) {
          const event = state.mainEvents.find(
            (item) =>
              item.mainEventsId === savedEvent.mainEventId
          );

          if (event && event.countSavedEvents > 0) {
            event.countSavedEvents -= 1;
          }
        }

        state.savedEvents = state.savedEvents.filter(
          (item) => item.savedEventId !== action.payload
        );
      })
      .addCase(deleteSavedEvent.rejected, (state, action) => {
        state.deletingSavedEvent = false;
        state.error = action.payload ?? "Failed to delete saved event";
      })

      // =====================================
      //              הצבעות
      // =====================================

      // שליפת ההצבעות של המשתמש
      .addCase(fetchMyVotes.pending, (state) => {
        state.loadingMyVotes = true;
        state.error = null;
      })
      .addCase(fetchMyVotes.fulfilled, (state, action) => {
        state.loadingMyVotes = false;
        state.votes = action.payload;
      })
      .addCase(fetchMyVotes.rejected, (state, action) => {
        state.loadingMyVotes = false;
        state.error = action.payload ?? "Failed to load votes";
      })

      // יצירת הצבעה
      .addCase(createVote.pending, (state) => {
        state.creatingVote = true;
        state.error = null;
      })
      .addCase(createVote.fulfilled, (state, action) => {
        state.creatingVote = false;

        const alreadyVoted = state.votes.some(
          (vote) =>
            vote.mainEventId === action.payload.mainEventId
        );

        if (!alreadyVoted) {
          state.votes.push(action.payload);

          const event = state.mainEvents.find(
            (item) =>
              item.mainEventsId === action.payload.mainEventId
          );

          if (event) {
            event.countVotes += 1;
          }
        }
      })
      .addCase(createVote.rejected, (state, action) => {
        state.creatingVote = false;
        state.error = action.payload ?? "Failed to create vote";
      })

      // ביטול הצבעה
      .addCase(deleteVote.pending, (state) => {
        state.deletingVote = true;
        state.error = null;
      })
      .addCase(deleteVote.fulfilled, (state, action) => {
        state.deletingVote = false;

        const vote = state.votes.find(
          (item) => item.voteId === action.payload
        );

        if (vote) {
          const event = state.mainEvents.find(
            (item) =>
              item.mainEventsId === vote.mainEventId
          );

          if (event && event.countVotes > 0) {
            event.countVotes -= 1;
          }
        }

        state.votes = state.votes.filter(
          (item) => item.voteId !== action.payload
        );
      })
      .addCase(deleteVote.rejected, (state, action) => {
        state.deletingVote = false;
        state.error = action.payload ?? "Failed to delete vote";
      })

      // =====================================
      //       מחיקת אירוע – מנהל
      // =====================================

      .addCase(deleteMainEvent.pending, (state) => {
        state.deletingMainEvent = true;
        state.error = null;
      })
      .addCase(deleteMainEvent.fulfilled, (state, action) => {
        state.deletingMainEvent = false;

        state.mainEvents = state.mainEvents.filter(
          (event) => event.mainEventsId !== action.payload
        );

        state.savedEvents = state.savedEvents.filter(
          (event) => event.mainEventId !== action.payload
        );

        state.votes = state.votes.filter(
          (vote) => vote.mainEventId !== action.payload
        );
      })
      .addCase(deleteMainEvent.rejected, (state, action) => {
        state.deletingMainEvent = false;
        state.error = action.payload ?? "Failed to delete event";
      });
  },
});

export default eventsSlice.reducer;
