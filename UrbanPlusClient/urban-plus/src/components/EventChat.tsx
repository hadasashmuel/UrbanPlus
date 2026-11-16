
import { useEffect, useRef, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { useAppSelector } from "../store/hooks";
import ShortUserProfile from "./ShortUserProfile";
import "./EventChat.css";

interface EventChatProps {
  mainEventId: number;
}

interface ChatMessage {
  messageId: number;
  userId: number;
  mainEventId: number;
  content: string;
  createdAt: string;
  isDeleted: boolean;
  userName: string;
}

const API_URL = "https://localhost:7019/api/Message";
const HUB_URL = "https://localhost:7019/hubs/event-chat";

function EventChat({ mainEventId }: EventChatProps) {
  const token = useAppSelector((state) => state.users.token);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const connectionRef = useRef<HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // הוספת הודעה בלי ליצור כפילויות
  const addMessage = (message: ChatMessage) => {
    if (message.mainEventId !== mainEventId || message.isDeleted) {
      return;
    }

    setMessages((previous) => {
      if (previous.some((item) => item.messageId === message.messageId)) {
        return previous;
      }

      return [...previous, message].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    });
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // הודעה חדשה שהגיעה דרך SignalR
    connection.on("ReceiveMessage", (message: ChatMessage) => {
      if (isActive) {
        addMessage(message);
      }
    });

    // חיבור מחדש מחייב הצטרפות חוזרת לקבוצה
    connection.onreconnected(async () => {
      try {
        await connection.invoke("JoinEventGroup", mainEventId);
      } catch (err) {
        console.error("לא ניתן להצטרף מחדש לקבוצת הצ'אט:", err);
      }
    });

    const startChat = async () => {
      try {
        await connection.start();

        if (!isActive) return;

        await connection.invoke("JoinEventGroup", mainEventId);

        const response = await fetch(
          `${API_URL}/event/${mainEventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("טעינת ההודעות נכשלה");
        }

        const existingMessages: ChatMessage[] = await response.json();

        if (isActive) {
          setMessages((previous) => {
            const allMessages = [...previous, ...existingMessages];

            return allMessages
              .filter(
                (message, index, array) =>
                  array.findIndex(
                    (item) => item.messageId === message.messageId
                  ) === index
              )
              .filter((message) => !message.isDeleted)
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
          });

          setLoading(false);
        }
      } catch (err) {
        console.error("שגיאה בפתיחת הצ'אט:", err);

        if (isActive) {
          setError("לא ניתן לטעון את הצ'אט כרגע");
          setLoading(false);
        }
      }
    };

    startChat();

    return () => {
      isActive = false;
      connection.off("ReceiveMessage");
      connection.stop();
      connectionRef.current = null;
    };
  }, [mainEventId, token]);

  // גלילה להודעה האחרונה
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();

    if (!content || !token || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mainEventId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("שליחת ההודעה נכשלה");
      }

      setNewMessage("");
    } catch (err) {
      console.error("שגיאה בשליחת הודעה:", err);
      setError("לא הצלחנו לשלוח את ההודעה. נסי שוב.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!token) {
    return (
      <section className="event-chat">
        <h3>💬 שיחה על האירוע</h3>
        <p className="event-chat-login">
          כדי לצפות בצ'אט ולשלוח הודעות יש להתחבר למערכת.
        </p>
      </section>
    );
  }

  return (
    <section className="event-chat" dir="rtl">
      <div className="event-chat-heading">
        <h3>💬 שיחה על האירוע</h3>
        <span>{messages.length} הודעות</span>
      </div>

      <div className="event-chat-messages">
        {loading && (
          <p className="event-chat-info">טוען הודעות...</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="event-chat-info">
            עדיין אין הודעות באירוע. אפשר להתחיל את השיחה!
          </p>
        )}

        {messages.map((message) => (
          <div className="event-chat-message" key={message.messageId}>
            <div className="event-chat-message-header">
              <button
                type="button"
                className="event-chat-user-link"
                onClick={() => setSelectedUserId(message.userId)}
              >
                {message.userName || "משתמש"}
              </button>

              <span>
                {new Date(message.createdAt).toLocaleString("he-IL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <p>{message.content}</p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {error && <p className="event-chat-error">{error}</p>}

      <div className="event-chat-input-area">
        <textarea
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="כתבי הודעה על האירוע..."
          maxLength={100}
          rows={2}
          disabled={sending}
        />

        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? "שולח..." : "שליחה"}
        </button>
      </div>

      <small className="event-chat-hint">
        Enter לשליחה · Shift + Enter לירידת שורה
      </small>

      {selectedUserId !== null && (
        <ShortUserProfile
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </section>
  );
}

export default EventChat;
