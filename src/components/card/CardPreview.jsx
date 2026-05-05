import { forwardRef } from "react";

export const CardPreview = forwardRef(
  ({ content, author, theme }, forwardedRef) => {
    const quoteColor = theme?.quoteStyle?.color || "#ffffff";

    return (
      <div
        ref={forwardedRef}
        className="flex h-[540px] w-[540px] items-center justify-center"
        style={theme?.containerStyle}
      >
        <div className="relative text-center">
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] font-serif leading-none"
            style={{ color: quoteColor, opacity: 0.15 }}
          >
            &quot;
          </div>
          <p style={theme?.quoteStyle}>{content}</p>
          <p style={{ ...theme?.authorStyle, marginTop: 24 }}>— {author}</p>
        </div>
      </div>
    );
  }
);
