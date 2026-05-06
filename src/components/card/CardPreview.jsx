import { forwardRef } from "react";

export const CardPreview = forwardRef(
  ({ content, author, theme }, forwardedRef) => {
    const quoteColor = theme?.quoteStyle?.color || "#ffffff";

    const displayContent =
      content.length > 800 ? content.slice(0, 800) + "…" : content;

    const fontSizeOverride =
      content.length <= 120
        ? undefined
        : content.length <= 200
        ? "22px"
        : content.length <= 300
        ? "18px"
        : "15px";

    return (
      <div
        ref={forwardedRef}
        className="flex h-[540px] w-[540px] items-center justify-center rounded-2xl"
        style={{ ...theme?.containerStyle, overflow: "hidden" }}
      >
        <div className="relative text-center">
          <div
            className="absolute -top-14 left-1/2 -translate-x-1/2 text-[120px] font-serif leading-none"
            style={{ color: quoteColor, opacity: 0.15 }}
          >
            &quot;
          </div>
          <p
            style={{
              ...theme?.quoteStyle,
              ...(fontSizeOverride ? { fontSize: fontSizeOverride } : {}),
            }}
          >
            {displayContent}
          </p>
          <p style={{ ...theme?.authorStyle, marginTop: 24 }}>— {author}</p>
        </div>
      </div>
    );
  }
);
