import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "../../lib/supabase";

const INITIAL_MESSAGE = {
  role: "model",
  content:
    "Hi! Ask me anything about quotes — their meaning, authors, history, or themes. I'm here to help.",
};

const CHAT_HINT_KEY = "quotidian_chat_hint";
const BUBBLE_CLICKED_KEY = "quotidian_bubble_clicked";

export const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    { ...INITIAL_MESSAGE, timestamp: new Date().toISOString() },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const endRef = useRef(null);
  const hintTimerRef = useRef(null);
  const hintHideTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const hintShown = localStorage.getItem(CHAT_HINT_KEY);
    if (!hintShown) {
      hintTimerRef.current = setTimeout(() => {
        setShowHint(true);
        localStorage.setItem(CHAT_HINT_KEY, "shown");
        hintHideTimerRef.current = setTimeout(() => {
          setShowHint(false);
        }, 4000);
      }, 3000);
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
          localStorage.setItem(CHAT_HINT_KEY, "shown");
        }
      }
      return next;
    });
  };

  const handleSend = async (text) => {
    if (isLoading || !text.trim()) return;

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
        <div className="fixed bottom-[92px] right-6 z-50 flex h-[60vh] max-h-[70vh] w-[calc(100%-48px)] max-w-[320px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl sm:inset-auto sm:bottom-[92px] sm:right-[32rem] sm:h-[500px] sm:w-[380px] sm:max-w-none">
          <div className="border-b border-neutral-200 bg-primary-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">
                <span className="mr-1">✨</span>
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
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center sm:right-[32rem]">
        {showHint ? (
          <div className="absolute bottom-full mb-3 flex flex-col items-center">
            <div className="relative rounded-full bg-primary-600 px-4 py-2 text-sm text-white shadow-md motion-safe:animate-bounce">
              Ask me about any quote!
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-primary-600" />
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
