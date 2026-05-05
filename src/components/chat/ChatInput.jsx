import { useState } from "react";

export const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setMessage("");
  };

  return (
    <form
      className="flex items-center gap-3 border-t border-neutral-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="flex-1 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        placeholder="Ask about a quote..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send
      </button>
    </form>
  );
};
