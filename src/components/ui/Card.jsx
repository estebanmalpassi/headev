import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-accent-bright p-5 bg-gradient-to-b from-bg-surface to-bg-deep shadow-[inset_0_0_40px_rgba(126,34,206,0.18)] ${className}`}>
      {title && (
        <h4 style={{ fontFamily: "var(--font-pixel-ui)" }} className="text-white text-sm mb-2">
          {title}
        </h4>
      )}
      <div className="text-ink-300 text-[13.5px]">{children}</div>
    </div>
  );
}
