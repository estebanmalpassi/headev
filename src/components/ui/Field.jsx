import React from "react";

export default function Field({ label, as = "input", className = "", ...props }) {
  const Tag = as;
  return (
    <div className={`flex flex-col gap-1.5 max-w-sm ${className}`}>
      {label && (
        <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1 }} className="uppercase text-ink-500">
          {label}
        </label>
      )}
      <Tag
        style={{ fontFamily: "var(--font-body)" }}
        className="bg-void border-2 border-accent focus:border-accent-glow focus:shadow-glowSm rounded text-white text-sm px-3 py-2.5 outline-none placeholder:text-ink-500"
        {...props}
      />
    </div>
  );
}
