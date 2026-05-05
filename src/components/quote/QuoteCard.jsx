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
    <div className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="text-6xl font-serif text-primary-100">&quot;</div>
      <p className="mt-2 font-serif text-xl italic leading-relaxed text-neutral-800">
        {content}
      </p>
      <p className="mt-4 text-sm text-neutral-500">— {author}</p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {showShare && (
          <button
            type="button"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Share quote"
            onClick={() => setIsShareOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M14 8l-4 4 4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12h9a4 4 0 1 1 0 8h-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
