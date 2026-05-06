import { useRef, useState } from "react";
import { toBlob, toPng } from "html-to-image";
import { CardPreview } from "./CardPreview";
import { cardThemes } from "./cardThemes";
import { Modal } from "../ui/Modal";

export const ShareModal = ({
  isOpen,
  onClose,
  content,
  author,
  tags,
  sourceId,
}) => {
  const cardRef = useRef(null);
  const [selectedThemeId, setSelectedThemeId] = useState(cardThemes[0]?.id);
  const [copied, setCopied] = useState(false);

  const theme =
    cardThemes.find((item) => item.id === selectedThemeId) ?? cardThemes[0];

  const handleDownload = async () => {
    if (!cardRef.current) {
      return;
    }

    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "quote.png";
    link.href = dataUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!cardRef.current) {
      return;
    }

    const blob = await toBlob(cardRef.current, { pixelRatio: 2 });
    if (!blob) {
      return;
    }

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${content} — ${author}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${content}" — ${author}`
  )}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">Share</h2>
        <button
          type="button"
          className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
          onClick={onClose}
          aria-label="Close share modal"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6l-12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Card preview — scales down on mobile */}
      <div className="relative mt-2 flex h-[390px] items-center justify-center px-0 sm:mt-6 sm:h-auto">
        <div className="absolute -left-[9999px] top-0" aria-hidden="true">
          <CardPreview
            ref={cardRef}
            content={content}
            author={author}
            theme={theme}
          />
        </div>

        <div className="origin-center scale-[0.68] sm:scale-100">
          <CardPreview content={content} author={author} theme={theme} />
        </div>
      </div>

      {/* Theme selector — horizontally scrollable on mobile */}
      <div className="mt-1 flex w-full gap-3 overflow-x-auto px-2 py-1 sm:mt-6 sm:justify-center sm:overflow-x-visible">
        {cardThemes.map((item) => {
          const isSelected = item.id === theme.id;
          const previewBackground = item.containerStyle?.background;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.name}
              onClick={() => setSelectedThemeId(item.id)}
              className={`h-10 w-10 flex-shrink-0 rounded-full border border-neutral-200 ring-offset-2 ring-offset-white ${
                isSelected ? "ring-2 ring-neutral-900" : "ring-0"
              }`}
              style={{ background: previewBackground }}
            />
          );
        })}
      </div>

      {/* Action buttons — single column on mobile, 2-col on sm+ */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          onClick={handleDownload}
        >
          Download PNG
        </button>
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          onClick={() => handleShare(whatsappUrl)}
        >
          Share to WhatsApp
        </button>
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          onClick={() => handleShare(twitterUrl)}
        >
          Share to Twitter
        </button>
      </div>
    </Modal>
  );
};
