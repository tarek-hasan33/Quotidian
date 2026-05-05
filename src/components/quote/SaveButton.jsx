import { useMemo, useState } from "react";
import { useSavedQuotes } from "../../hooks/useSavedQuotes";
import { useAuth } from "../../hooks/useAuth";

export const SaveButton = ({ sourceId, content, author, tags }) => {
  const { user } = useAuth();
  const { saveQuote, unsaveQuote, isSaved, getSavedId } = useSavedQuotes();
  const [isSaving, setIsSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const saved = useMemo(() => isSaved(sourceId), [isSaved, sourceId]);

  const handleClick = async () => {
    if (!user) {
      setShowTooltip(true);
      window.setTimeout(() => setShowTooltip(false), 1500);
      return;
    }

    setIsSaving(true);

    if (saved) {
      const savedId = getSavedId(sourceId);
      if (savedId) {
        await unsaveQuote(savedId);
      }
    } else {
      await saveQuote({ content, author, tags, sourceId });
    }

    setIsSaving(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`rounded-lg p-2 hover:bg-neutral-100 ${
          saved ? "text-amber-500" : "text-neutral-300"
        }`}
        aria-label={saved ? "Unsave quote" : "Save quote"}
        onClick={handleClick}
        disabled={isSaving}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 21l-7-6.5a4.2 4.2 0 0 1 0-6 4.1 4.1 0 0 1 5.8 0L12 9.7l1.2-1.2a4.1 4.1 0 0 1 5.8 0 4.2 4.2 0 0 1 0 6L12 21z"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      {isSaving && (
        <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-neutral-300" />
      )}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white">
          Sign in to save quotes
        </div>
      )}
    </div>
  );
};
