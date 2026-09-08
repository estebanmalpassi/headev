/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#170729",
        "bg-deep": "#2A0E4F",
        "bg-surface": "#3B1370",
        "bg-elevated": "#4C1D95",
        "bg-elevated-2": "#581C87",
        accent: "#6B21A8",
        "accent-bright": "#7E22CE",
        "accent-glow": "#B45CF0",
        cream: "#F3ECD9",
        "ink-100": "#F4EEFB",
        "ink-300": "#C9B8E0",
        "ink-500": "#9A85B8",
        success: "#34D97A",
        warning: "#F5A524",
        error: "#F1495B",
        info: "#5B8DEF",
      },
      fontFamily: {
        pixelBlock: ["'Press Start 2P'", "monospace"],
        pixelUi: ["'Silkscreen'", "monospace"],
        pixelTerm: ["'VT323'", "monospace"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0px #000000",
        "hard-sm": "2px 2px 0px #000000",
        glowSm: "0 0 12px rgba(180,92,240,0.35)",
        glowMd: "0 0 24px rgba(180,92,240,0.35), 0 0 4px rgba(255,255,255,0.15) inset",
      },
    },
  },
  plugins: [],
};
