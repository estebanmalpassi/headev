import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Menu } from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";

const F = {
  ui: "'Silkscreen', monospace",
  term: "'VT323', monospace",
  mono: "'JetBrains Mono', monospace",
};

const STAGES = ["Negocio", "Usuarios", "Funcionalidades", "Flujo de uso", "Diseño", "Integraciones"];
const GREETING = {
  from: "ai",
  text: "Cuéntame qué quieres construir. Voy a hacerte algunas preguntas para convertir tu idea en requisitos concretos.",
};

function TypingDots() {
  return (
    <div className="flex gap-1 px-3.5 py-3 rounded bg-bg-surface border-l-[3px] border-accent-glow w-fit">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent-glow animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export default function DiscoveryChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const started = messages.length > 1; // ya hubo al menos una respuesta del cliente
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  // Devuelve el foco al input apenas se vuelve a habilitar (al cargar,
  // y después de cada respuesta de la IA), para no tener que tocarlo de nuevo.
  useEffect(() => {
    if (!typing && !done) inputRef.current?.focus();
  }, [typing, done]);

  async function send() {
    if (!draft.trim() || typing || done) return;
    const next = [...messages, { from: "user", text: draft }];
    setMessages(next);
    setDraft("");
    setTyping(true);
    try {
      const res = await fetch("/api/discovery-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al hablar con la IA.");
      setMessages((m) => [...m, { from: "ai", text: data.reply }]);
      if (typeof data.stage_index === "number") setStageIndex(data.stage_index);
      if (data.done) {
        setDone(true);
        setTimeout(
          () => navigate("/activate", { state: { projectName: data.project_name, summary: data.reply } }),
          2200
        );
      }
    } catch (err) {
      const fallback = "No pude conectar con el servidor. ¿Está corriendo npm run dev con la API key configurada?";
      setMessages((m) => [...m, { from: "ai", text: `⚠️ ${err.message || fallback}` }]);
    } finally {
      setTyping(false);
    }
  }

  const progressPct = !started ? 0 : done ? 100 : Math.round(((stageIndex + 0.5) / STAGES.length) * 100);

  return (
    <div className="h-screen flex flex-col bg-void">
      <header className="shrink-0 border-b-2 border-black bg-gradient-to-r from-accent to-accent-bright">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <HandevMark size={24} />
            <div>
              <div style={{ fontFamily: F.ui, fontSize: 12, letterSpacing: 0.5 }} className="text-white">HAND<span className="text-white/90" style={{ display: "inline-block", transform: "translateY(-0.04em)" }}>Ξ</span>V</div>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: 1.5 }} className="text-white/75">AI PROJECT ANALYST</div>
            </div>
          </div>
          <Menu size={18} className="text-white/80" />
        </div>
        <div className="px-4 pb-3">
          <div className="h-2 border border-black bg-black/25 overflow-hidden">
            <div className="h-full bg-[repeating-linear-gradient(90deg,#F3ECD9_0px,#F3ECD9_6px,#B45CF0_6px,#B45CF0_12px)] transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 9.5 }} className="text-white/70 mt-1">
            {started ? `ETAPA ${stageIndex + 1}/${STAGES.length} · ${STAGES[stageIndex].toUpperCase()}` : "AÚN NO EMPEZASTE"}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px), #2A0E4F" }}>
        {messages.map((m, i) => (
          <div key={i} className={m.from === "ai" ? "max-w-[85%] self-start rounded px-3.5 py-2.5 text-[14.5px] bg-bg-surface border-l-[3px] border-accent-glow text-ink-100" : "max-w-[85%] self-end rounded px-3.5 py-2.5 text-[14.5px] bg-accent-glow text-void font-medium"}>
            {m.from === "ai" && <span style={{ fontFamily: F.term, color: "#B45CF0", fontSize: 18 }} className="mr-1.5">▸</span>}
            {m.text}
          </div>
        ))}
        {typing && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {done ? (
        <div style={{ fontFamily: F.mono, fontSize: 11 }} className="shrink-0 text-center py-3 text-accent-glow bg-void border-t-2 border-black">
          ✓ Relevamiento completo — redirigiendo a activación...
        </div>
      ) : (
        <>
          <div className="shrink-0 flex gap-2 px-3.5 py-3 border-t-2 border-black bg-void">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={typing}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-bg-deep border border-accent focus:border-accent-glow rounded text-white text-[14.5px] px-3.5 py-2.5 outline-none placeholder:text-ink-500 disabled:opacity-50"
            />
            <button onClick={send} disabled={typing} className="w-11 h-11 shrink-0 flex items-center justify-center rounded border-2 border-black bg-accent-glow text-void active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50">
              <Send size={17} />
            </button>
          </div>
          {import.meta.env.DEV && (
            <button onClick={() => navigate("/activate")} style={{ fontFamily: F.mono, fontSize: 10 }} className="shrink-0 text-center py-1.5 text-ink-500 hover:text-white bg-void border-t border-accent/40">
              (demo) saltar a activación →
            </button>
          )}
        </>
      )}
    </div>
  );
}
