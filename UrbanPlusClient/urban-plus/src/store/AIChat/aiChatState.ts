
export type SenderType = "User" | "AI";

export interface AIChatMessage {
  aiChatMessageId: number;
  aiChatSessionId: number;
  senderType: SenderType;
  content: string;
  createdAt: string;
}

export interface AIChatState {
  messages: AIChatMessage[];
  sessionId: number | null;
  loading: boolean;
  sending: boolean;
  streaming: boolean;
  error: string | null;
}

export const initialState: AIChatState = {
  messages: [],
  sessionId: null,
  loading: false,
  sending: false,
  streaming: false,
  error: null,
};
