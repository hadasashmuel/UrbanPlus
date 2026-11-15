
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { streamAIMessage } from "../store/AIChat/aiChatThunks";
import { clearAIChat } from "../store/AIChat/aiChatSlice";
import "./AIChat.css";

function AIChat() {
  const dispatch = useAppDispatch();

  const {
    messages,
    sessionId,
    streaming: loading,
    error,
  } = useAppSelector((state) => state.aiChat);

  const token = useAppSelector((state) => state.users.token);

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading || !token) return;

    setMessage("");

    dispatch(
      streamAIMessage({
        content: trimmedMessage,
        aiChatSessionId: sessionId,
      })
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    if (loading) return;

    dispatch(clearAIChat());
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="urban-chat-widget" dir="rtl">

      {/* Floating chat window */}
      {isOpen && (
        <>
          <div
            className="urban-chat-backdrop"
            onClick={() => setIsOpen(false)}
          />

          <section
            className="urban-chat-window"
            aria-label="צ'אט UrbanPlus"
          >

            {/* Header */}
            <header className="urban-chat-header">

              <div className="urban-header-info">
                <div className="urban-header-logo">
                  U<span>+</span>
                </div>

                <div className="urban-header-text">
                  <h3>URBAN<span>+</span></h3>
                  <div className="urban-header-status">
                    <span className="urban-status-dot" />
                    מרכז השירות
                  </div>
                </div>
              </div>

              <div className="urban-header-actions">

                <button
                  className="urban-header-button"
                  onClick={handleNewChat}
                  disabled={loading}
                  title="שיחה חדשה"
                  aria-label="שיחה חדשה"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>

                <button
                  className="urban-header-button close-chat-button"
                  onClick={() => setIsOpen(false)}
                  title="סגירה"
                  aria-label="סגירת הצ'אט"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>

              </div>
            </header>

            {/* Messages */}
            <main className="urban-chat-messages">

              {messages.length === 0 && (
                <div className="urban-chat-welcome">

                  <div className="urban-welcome-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                    </svg>
                  </div>

                  <h2>שלום, טוב לראות אותך!</h2>

                  <p>
                    אני כאן כדי לעזור לך למצוא מידע על
                    מפגעים עירוניים, לבדוק דיווחים
                    ולהכיר את מה שקורה בסביבה שלך.
                  </p>

                  <div className="urban-suggestions">

                    <button
                      onClick={() =>
                        handleSuggestion("אילו מפגעים פתוחים קיימים?")
                      }
                    >
                      <span>🚧</span>
                      מפגעים פתוחים
                    </button>

                    <button
                      onClick={() =>
                        handleSuggestion("אילו מפגעים קיימים ברחוב שלי?")
                      }
                    >
                      <span>📍</span>
                      מפגעים באזור שלי
                    </button>

                    <button
                      onClick={() =>
                        handleSuggestion("אילו קטגוריות מפגעים קיימות במערכת?")
                      }
                    >
                      <span>🔎</span>
                      קטגוריות מפגעים
                    </button>

                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={`${msg.aiChatMessageId}-${index}`}
                  className={`urban-message ${
                    msg.senderType === "User"
                      ? "urban-user-message"
                      : "urban-ai-message"
                  }`}
                >

                  {msg.senderType !== "User" && (
                    <div className="urban-message-avatar">
                      U<span>+</span>
                    </div>
                  )}

                  <div className="urban-message-content">
                    {msg.content || (loading ? "מקליד..." : "")}
                  </div>

                </div>
              ))}

              {loading && messages[messages.length - 1]?.senderType === "User" && (
                <div className="urban-message urban-ai-message">
                  <div className="urban-message-avatar">
                    U<span>+</span>
                  </div>
                  <div className="urban-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {error && (
                <div className="urban-chat-error">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />

            </main>

            {/* Input */}
            <footer className="urban-chat-footer">

              {!token ? (
                <p className="urban-login-message">
                  יש להתחבר כדי להשתמש בצ'אט
                </p>
              ) : (
                <>
                  <div className="urban-input-container">

                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder="כתבו הודעה..."
                      rows={1}
                      disabled={loading}
                    />

                    <button
                      className="urban-send-button"
                      onClick={handleSend}
                      disabled={!message.trim() || loading}
                      title="שליחת הודעה"
                      aria-label="שליחת הודעה"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </button>

                  </div>

                  <div className="urban-input-caption">
                    UrbanPlus AI · תמיד כאן לעזור
                  </div>
                </>
              )}

            </footer>

          </section>
        </>
      )}

      {/* Floating button */}
      <button
        className={`urban-chat-launcher ${
          isOpen ? "urban-launcher-open" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "סגירת הצ'אט" : "פתיחת הצ'אט"}
        title="UrbanPlus AI"
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          </svg>
        )}

        {!isOpen && (
          <span className="urban-launcher-label">
            צריכים עזרה?
          </span>
        )}
      </button>

    </div>
  );
}

export default AIChat;
