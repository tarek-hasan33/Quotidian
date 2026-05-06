const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const ChatMessage = ({ role, content, timestamp }) => {
  const isUser = role === "user";
  const maxWidthClass = isUser
    ? "max-w-[80%] sm:max-w-xs"
    : "max-w-[80%] sm:max-w-sm";
  const timeLabel = formatTimestamp(timestamp);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className={`flex ${maxWidthClass} flex-col items-end gap-1`}>
          <div className="w-full rounded-2xl rounded-br-sm border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white">
            {content}
          </div>
          {timeLabel ? (
            <span className="text-[11px] text-neutral-500">{timeLabel}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
        Q
      </div>
      <div className={`flex ${maxWidthClass} flex-col items-start gap-1`}>
        <div className="w-full rounded-2xl rounded-bl-sm border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800">
          {content}
        </div>
        {timeLabel ? (
          <span className="text-[11px] text-neutral-500">{timeLabel}</span>
        ) : null}
      </div>
    </div>
  );
};
