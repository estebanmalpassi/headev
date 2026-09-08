import React from "react";

const F = { block: "'Press Start 2P', monospace" };

export function HandevMark({ size = 24, className = "" }) {
  return (
    <img
      src="/assets/handev-icon-transparent.png"
      alt="HANDEV"
      width={size}
      style={{ width: size, height: "auto", display: "block" }}
      className={className}
    />
  );
}

export function LogoFull({ width = 180, className = "" }) {
  return (
    <img
      src="/assets/handev-logo-full.png"
      alt="HANDEV"
      width={width}
      style={{ width, height: "auto", display: "block" }}
      className={className}
    />
  );
}

export function LogoHorizontal({ size = 24 }) {
  return (
    <div className="flex items-center gap-2.5">
      <HandevMark size={size} />
      <span style={{ fontFamily: F.block, fontSize: size * 0.55, letterSpacing: 1 }} className="text-cream">
        handev
      </span>
    </div>
  );
}
