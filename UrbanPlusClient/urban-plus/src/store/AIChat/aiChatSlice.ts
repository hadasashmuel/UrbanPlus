
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./aiChatState";
import type { AIChatMessage } from "./aiChatState";
import { sendAIMessage, streamAIMessage } from "./aiChatThunks";

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,

  reducers: {
    aiChatChunkReceived: (
      state,
      action: PayloadAction<{ sessionId: number; content: string }>
    ) => {
      const { sessionId, content } = action.payload;

      state.sessionId = sessionId;

      const lastMessage = state.messages[state.messages.length - 1];

      if (lastMessage?.senderType === "AI") {
        lastMessage.content += content;
      } else {
        state.messages.push({
          aiChatMessageId: Date.now(),
          aiChatSessionId: sessionId,
          senderType: "AI",
          content,
          createdAt: new Date().toISOString(),
        });
      }
    },

    clearAIChat: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.loading = false;
      state.sending = false;
      state.streaming = false;
      state.error = null;
    },

    addUserMessage: (state, action: PayloadAction<AIChatMessage>) => {
      state.messages.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.sessionId = action.payload.sessionId;
        state.messages.push(action.payload.userMessage);
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload ?? "שליחת ההודעה נכשלה";
      })

      .addCase(streamAIMessage.pending, (state, action) => {
        state.streaming = true;
        state.error = null;

        state.messages.push({
          aiChatMessageId: Date.now(),
          aiChatSessionId: action.meta.arg.aiChatSessionId ?? 0,
          senderType: "User",
          content: action.meta.arg.content,
          createdAt: new Date().toISOString(),
        });
      })
      .addCase(streamAIMessage.fulfilled, (state, action) => {
        state.streaming = false;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(streamAIMessage.rejected, (state, action) => {
        state.streaming = false;
        state.error = action.payload ?? "קבלת תשובת ה-AI נכשלה";
      });
  },
});

export const {
  aiChatChunkReceived,
  clearAIChat,
  addUserMessage,
} = aiChatSlice.actions;

export default aiChatSlice.reducer;
