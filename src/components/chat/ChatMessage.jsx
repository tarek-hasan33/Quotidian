export const ChatMessage = ({ role, content }) => {
  const isUser = role === "user";
  const maxWidthClass = isUser ? "max-w-xs" : "max-w-sm";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`${maxWidthClass} rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "rounded-br-sm bg-primary-600 text-white"
            : "rounded-bl-sm border border-neutral-200 bg-white text-neutral-800"
        }`}
      >
        {content}
      </div>
    </div>
  );
};
