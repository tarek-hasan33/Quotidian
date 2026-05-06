import { useState } from "react";
import { SaveButton } from "./SaveButton";
import { TagPill } from "./TagPill";
import { ShareModal } from "../card/ShareModal";

export const QuoteCard = ({
  content,
  author,
  tags = [],
  sourceId,
  showSave = true,
  showShare = true,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Decorative quote mark */}
      <div className="text-6xl font-serif text-primary-100">&quot;</div>

      {/* Quote text — flex-1 so it fills available space */}
      <p
        className="-mt-4 flex-1 font-serif text-lg italic leading-relaxed text-neutral-800 sm:text-xl"
        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
      >
        {content}
      </p>

      {/* Bottom section — mt-auto pins it to the bottom */}
      <div className="mt-auto min-w-0">
        <div className="mt-4 flex min-w-0 items-center justify-between gap-2">
          <p
            className="min-w-0 truncate text-sm text-neutral-500"
            style={{ maxWidth: "65%" }}
          >
            — {author}
          </p>
          <div className="flex flex-shrink-0 items-center gap-2">
            {showShare && (
              <button
                type="button"
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Share quote"
                onClick={() => setIsShareOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M12 16V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 10.5L12 7l3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M5 16.5a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 16.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            )}
            {showSave && (
              <SaveButton
                sourceId={sourceId}
                content={content}
                author={author}
                tags={tags}
              />
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        content={content}
        author={author}
        tags={tags}
        sourceId={sourceId}
      />
    </div>
  );
};
