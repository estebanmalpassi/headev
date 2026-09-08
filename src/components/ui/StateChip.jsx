import React from "react";

const STYLES = {
  success: { border: "border-success", bg: "bg-success/10", text: "text-[#8FF0B8]", dot: "bg-success" },
  warning: { border: "border-warning", bg: "bg-warning/10", text: "text-[#FDCB7E]", dot: "bg-warning" },
  error: { border: "border-error", bg: "bg-error/10", text: "text-[#FBA3AC]", dot: "bg-error" },
  info: { border: "border-info", bg: "bg-info/10", text: "text-[#A9C2F7]", dot: "bg-info" },
};

export default function StateChip({ state = "info", children }) {
  const s = STYLES[state];
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }} className={`inline-flex items-center gap-2.5 rounded px-3.5 py-2.5 border ${s.border} ${s.bg} ${s.text}`}>
      <span className={`w-2.5 h-2.5 rounded-sm ${s.dot}`} />
      {children}
    </div>
  );
}
