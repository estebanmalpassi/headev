import React from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded px-6 py-3.5 border-2 transition-transform active:translate-x-[2px] active:translate-y-[2px]";

const VARIANTS = {
  primary: "bg-accent-glow text-void border-black shadow-hard hover:shadow-[4px_4px_0px_#000,0_0_18px_rgba(180,92,240,0.5)]",
  secondary: "bg-transparent text-white border-accent-glow hover:bg-accent-glow/10",
  ghost: "bg-transparent text-ink-300 border-transparent hover:text-white",
  danger: "bg-error text-white border-black shadow-hard",
};

export default function Button({ variant = "primary", children, disabled, className = "", ...props }) {
  return (
    <button
      disabled={disabled}
      className={`${BASE} ${VARIANTS[variant]} ${disabled ? "opacity-40 cursor-not-allowed shadow-none" : "cursor-pointer"} ${className}`}
      style={{ fontFamily: "var(--font-pixel-ui)", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}
      {...props}
    >
      {children}
    </button>
  );
}
