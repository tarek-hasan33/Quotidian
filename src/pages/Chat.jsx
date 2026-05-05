import { useEffect, useRef, useState } from "react";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatMessage } from "../components/chat/ChatMessage";
import { supabase } from "../lib/supabase";

const INITIAL_MESSAGE = {
  role: "model",
  content:
    "Hi! Ask me anything about quotes — their meaning, authors, history, or themes. I'm here to help.",
};

export const Chat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const nextMessages = [...messages, { role: "user", content: text }];
    const trimmedMessages = nextMessages.slice(-20);

    setMessages(trimmedMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: trimmedMessages },
      });

      if (error) {
        throw error;
      }

      const reply = data?.data ?? "";
      setMessages((prev) =>
        [...prev, { role: "model", content: reply || "..." }].slice(-20)
      );
    } catch (error) {
      setMessages((prev) =>
        [
          ...prev,
          { role: "model", content: "Something went wrong, try again." },
        ].slice(-20)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col bg-neutral-50">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={`${message.role}-${index}`}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && <ChatMessage role="model" content="..." />}
          <div ref={endRef} />
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
