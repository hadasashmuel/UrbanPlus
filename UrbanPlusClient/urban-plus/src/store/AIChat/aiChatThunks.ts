
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AIChatMessage } from "./aiChatState";
import { aiChatChunkReceived } from "./aiChatSlice";

const API_URL = "https://urbanpluspro.premiumasp.net/api/AIChat";

interface SendAIMessageRequest {
  content: string;
  aiChatSessionId?: number | null;
  mainEventId?: number | null;
}

interface AIChatStreamChunk {
  aiChatSessionId: number;
  content: string;
}

interface AIChatThunkConfig {
  state: { users: { token: string | null } };
  rejectValue: string;
}

export const sendAIMessage = createAsyncThunk<
  { userMessage: AIChatMessage; sessionId: number },
  SendAIMessageRequest,
  AIChatThunkConfig
>(
  "aiChat/sendAIMessage",
  async (messageData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "שליחת ההודעה נכשלה");
      }

      const aiMessage = (await response.json()) as AIChatMessage;

      const userMessage: AIChatMessage = {
        aiChatMessageId: Date.now(),
        aiChatSessionId: aiMessage.aiChatSessionId,
        senderType: "User",
        content: messageData.content,
        createdAt: new Date().toISOString(),
      };

      return {
        userMessage,
        sessionId: aiMessage.aiChatSessionId,
      };
    } catch {
      return rejectWithValue("לא ניתן להתחבר לשרת");
    }
  }
);

export const streamAIMessage = createAsyncThunk<
  { aiMessage: AIChatMessage; sessionId: number },
  SendAIMessageRequest,
  AIChatThunkConfig
>(
  "aiChat/streamAIMessage",
  async (messageData, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().users.token;

      if (!token) {
        return rejectWithValue("אין משתמש מחובר");
      }

      const response = await fetch(`${API_URL}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "שליחת ההודעה נכשלה");
      }

      if (!response.body) {
        return rejectWithValue("לא התקבל זרם נתונים מהשרת");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let fullContent = "";
      let sessionId = messageData.aiChatSessionId ?? 0;

      const processEvent = (event: string) => {
        const dataLines = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"));

        if (dataLines.length === 0) return;

        const data = dataLines
          .map((line) => line.slice(5).trim())
          .join("\n");

        if (!data || data === "[DONE]") return;

        const chunk = JSON.parse(data) as AIChatStreamChunk;

        if (!chunk.content) return;

        sessionId = chunk.aiChatSessionId;
        fullContent += chunk.content;

        dispatch(
          aiChatChunkReceived({
            sessionId,
            content: chunk.content,
          })
        );
      };

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";

        for (const event of events) {
          processEvent(event);
        }
      }

      buffer += decoder.decode();

      // עיבוד האירוע האחרון במקרה שהזרם הסתיים ללא שורה ריקה בסוף
      if (buffer.trim()) {
        processEvent(buffer);
      }

      if (!fullContent.trim()) {
        return rejectWithValue("לא התקבלה תשובה מה-AI");
      }

      return {
        sessionId,
        aiMessage: {
          aiChatMessageId: Date.now(),
          aiChatSessionId: sessionId,
          senderType: "AI",
          content: fullContent,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("AI STREAM ERROR:", error);

      return rejectWithValue(
        "אירעה שגיאה במהלך קבלת תשובת ה-AI"
      );
    }
  }
);
