import { useState } from "react";

export const ChatInput = ({
  onSend,
  disabled,
  placeholder = "Ask about a quote...",
  isRateLimited = false,
}) => {
  const [message, setMessage] = useState("");
  const isDisabled = disabled || !message.trim();

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
        className={`h-11 flex-1 rounded-lg border border-neutral-200 px-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-500 ${
          isRateLimited
            ? "bg-neutral-100 text-neutral-400"
            : "bg-white text-neutral-800"
        }`}
        placeholder={placeholder}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-neutral-900 transition-colors duration-150 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path d="M21 12l-18 9 4-9-4-9 18 9z" fill="currentColor" />
        </svg>
      </button>
    </form>
  );
};
