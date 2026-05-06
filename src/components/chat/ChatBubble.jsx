import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const INITIAL_MESSAGE = {
  role: "model",
  content:
    "Hi! Ask me anything about quotes — their meaning, authors, history, or themes. I'm here to help.",
};

const CHAT_HINT_SESSION_KEY = "quotidian_chat_hint_session";
const BUBBLE_CLICKED_KEY = "quotidian_bubble_clicked";

export const ChatBubble = () => {
  const { user } = useAuth();
  const DAILY_LIMIT = user ? 50 : 10;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    { ...INITIAL_MESSAGE, timestamp: new Date().toISOString() },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(DAILY_LIMIT);
  const endRef = useRef(null);
  const hintTimerRef = useRef(null);
  const hintHideTimerRef = useRef(null);

  const getChatUsage = () => {
    const today = new Date().toISOString().split("T")[0];
    if (typeof window === "undefined") {
      return { date: today, count: 0 };
    }

    const stored = localStorage.getItem("quotidian_chat_usage");
    if (!stored) return { date: today, count: 0 };

    try {
      const parsed = JSON.parse(stored);
      if (parsed.date !== today) return { date: today, count: 0 };
      return parsed;
    } catch {
      return { date: today, count: 0 };
    }
  };

  const incrementChatUsage = () => {
    if (typeof window === "undefined") {
      return;
    }

    const usage = getChatUsage();
    localStorage.setItem(
      "quotidian_chat_usage",
      JSON.stringify({
        date: usage.date,
        count: usage.count + 1,
      })
    );
  };

  const getRemainingMessages = () => {
    const limit = user ? 50 : 10;
    return Math.max(0, limit - getChatUsage().count);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    setRemainingMessages(getRemainingMessages());
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const hintShownThisSession = sessionStorage.getItem(CHAT_HINT_SESSION_KEY);
    if (!hintShownThisSession) {
      hintTimerRef.current = setTimeout(() => {
        setShowHint(true);
        sessionStorage.setItem(CHAT_HINT_SESSION_KEY, "shown");
        hintHideTimerRef.current = setTimeout(() => {
          setShowHint(false);
        }, 2500);
      }, 800);
    }

    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
      if (hintHideTimerRef.current) {
        clearTimeout(hintHideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clicked = localStorage.getItem(BUBBLE_CLICKED_KEY);
    setShowPulse(!clicked);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setShowHint(false);
        setShowPulse(false);
        if (typeof window !== "undefined") {
          localStorage.setItem(BUBBLE_CLICKED_KEY, "true");
        }
      }
      return next;
    });
  };

  const handleSend = async (text) => {
    if (isLoading || !text.trim()) return;

    const remaining = getRemainingMessages();
    if (remaining <= 0) {
      const message = user
        ? "You've reached your daily limit of 50 messages. Come back tomorrow for more quote conversations!"
        : "You've reached the daily limit of 10 messages for guests. Sign in to get 50 messages per day!";
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setRemainingMessages(0);
      return;
    }

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Add user message to state immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Build history including the new user message
    const history = [...messages, userMessage]
      .filter((message) => !message.isTyping)
      .slice(-20);

    // Add typing indicator
    setMessages((prev) => [
      ...prev,
      { role: "model", content: "...", isTyping: true },
    ]);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: history },
      });
      if (error) throw error;
      const reply = data?.data ?? "";
      setMessages((prev) => {
        const withoutTyping = prev.filter((message) => !message.isTyping);
        return [
          ...withoutTyping,
          {
            role: "model",
            content: reply,
            timestamp: new Date().toISOString(),
          },
        ].slice(-20);
      });
      incrementChatUsage();
      setRemainingMessages(getRemainingMessages());
    } catch {
      setMessages((prev) => {
        const withoutTyping = prev.filter((message) => !message.isTyping);
        return [
          ...withoutTyping,
          {
            role: "model",
            content: "Sorry, something went wrong. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ].slice(-20);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-[92px] right-6 z-50 flex h-[60vh] max-h-[70vh] w-[calc(100%-48px)] max-w-[320px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl sm:inset-auto sm:bottom-[92px] sm:h-[500px] sm:w-[380px] sm:max-w-none md:bottom-[104px] md:right-8 xl:right-[32rem]">
          <div className="border-b border-neutral-200 bg-primary-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">
                Quotidian Chat
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-white hover:text-neutral-700"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-600">Ask about quotes</p>
            {remainingMessages === 0 ? (
              <p className="mt-1 text-xs text-red-400">
                No messages left today
              </p>
            ) : (user && remainingMessages <= 15) ||
              (!user && remainingMessages <= 5) ? (
              <p
                className={`mt-1 text-xs ${
                  remainingMessages <= 5 ? "text-amber-500" : "text-neutral-400"
                }`}
              >
                {remainingMessages}/{DAILY_LIMIT} messages left today
              </p>
            ) : null}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={`${message.role}-${index}`}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-neutral-200 bg-white px-4 py-3">
            {!user && remainingMessages <= 3 ? (
              <div className="mb-3 rounded-lg bg-primary-50 px-3 py-2 text-center text-xs text-primary-700">
                <Link to="/login" className="font-medium hover:underline">
                  Sign in for 50 messages/day
                </Link>
              </div>
            ) : null}
            <ChatInput
              onSend={handleSend}
              disabled={isLoading || remainingMessages <= 0}
              placeholder={
                remainingMessages <= 0
                  ? "Daily limit reached. Come back tomorrow!"
                  : "Ask about a quote..."
              }
              isRateLimited={remainingMessages <= 0}
            />
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center md:bottom-8 md:right-8 xl:right-[32rem]">
        {showHint ? (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2">
            <div className="relative w-max whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 shadow-md">
              Ask me about any quote!
              <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r border-t border-neutral-200 bg-white" />
            </div>
          </div>
        ) : null}

        {showPulse ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/30" />
        ) : null}

        <button
          type="button"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-amber-100 shadow-lg transition hover:bg-neutral-800"
          aria-label="Open chat"
          onClick={handleToggle}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              d="M7 18l-3 3V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </>
  );
};
