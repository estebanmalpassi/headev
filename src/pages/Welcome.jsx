import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Check, MessageSquare, Lock, Sparkles, Instagram } from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";
import Button from "../components/ui/Button";

const F = {
  block: "'Press Start 2P', monospace",
  ui: "'Silkscreen', monospace",
  term: "'VT323', monospace",
  mono: "'JetBrains Mono', monospace",
};

const PROCESS_STEPS = [
  { icon: MessageSquare, title: "AI DISCOVERY", desc: "Conversás con HANDEV AI. Te hace preguntas concretas hasta convertir tu idea en requisitos claros." },
  { icon: Lock, title: "ACTIVACIÓN — $20", desc: "No es el precio del desarrollo. Es el paso que activa tu proyecto para revisión humana." },
  { icon: Check, title: "HUMAN DEVELOPMENT", desc: "Un desarrollador revisa tu proyecto y te contacta para construirlo de verdad." },
];

function useTypewriter(text, speed = 30) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

function ProcessCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PROCESS_STEPS.length), 3800);
    return () => clearInterval(id);
  }, [paused]);

  const step = PROCESS_STEPS[index];

  return (
    <section className="px-5 pt-10 pb-6 border-t border-accent/40" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-lg mx-auto">
        <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 3 }} className="text-accent-glow mb-2 text-center">PROCESO</div>
        <h2 style={{ fontFamily: F.ui, fontSize: 18 }} className="mb-6 text-center">De la idea al desarrollo, en tres pasos</h2>

        <div className="flex items-center gap-3">
          <button onClick={() => setIndex((i) => (i - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length)} className="shrink-0 w-8 h-8 rounded-full border border-accent/60 flex items-center justify-center text-ink-500 hover:text-white hover:border-accent-glow">
            <ChevronLeft size={16} />
          </button>

          <div className="flex-1 rounded-lg border-2 border-black bg-gradient-to-b from-bg-surface to-bg-deep p-6 shadow-hard min-h-[164px] flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded flex items-center justify-center border-2 border-black bg-accent-glow text-void mb-3">
              <step.icon size={19} />
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 13, letterSpacing: 0.5 }} className="text-white mb-2">
              {String(index + 1).padStart(2, "0")} · {step.title}
            </div>
            <p className="text-ink-300 text-[13.5px] leading-relaxed max-w-xs">{step.desc}</p>
          </div>

          <button onClick={() => setIndex((i) => (i + 1) % PROCESS_STEPS.length)} className="shrink-0 w-8 h-8 rounded-full border border-accent/60 flex items-center justify-center text-ink-500 hover:text-white hover:border-accent-glow">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {PROCESS_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Paso ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-accent-glow" : "w-2 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const typed = useTypewriter("Cuéntame qué quieres construir.");

  return (
    <div className="min-h-screen bg-void text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b border-accent/60 bg-void/90 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <HandevMark size={24} />
          <span style={{ fontFamily: F.block, fontSize: 13 }}>HAND<span className="text-accent-glow" style={{ display: "inline-block", transform: "translateY(-0.32em)" }}>Ξ</span>V</span>
        </div>
        <Button variant="secondary" className="!px-4 !py-2 text-[11px]" onClick={() => navigate("/discovery")}>
          EMPEZAR
        </Button>
      </header>

      <section className="relative px-5 pt-14 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-70" style={{ background: "radial-gradient(ellipse 700px 400px at 50% -10%, #4C1D95 0%, transparent 65%)" }} />
        <div className="relative max-w-lg mx-auto">
          <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 3 }} className="inline-flex items-center gap-2 text-accent-glow mb-5 border border-accent rounded-full px-3 py-1">
            <Sparkles size={12} /> AI DISCOVERY → HUMAN DEVELOPMENT
          </div>
          <h1 style={{ fontFamily: F.block, fontSize: "clamp(22px,6vw,34px)", lineHeight: 1.5 }} className="mb-5">
            Tu idea, convertida en<br /><span className="text-accent-glow">proyecto real</span>
          </h1>
          <p className="text-ink-300 text-[15px] max-w-sm mx-auto mb-8">
            Hablá con HANDEV AI, respondé algunas preguntas, y en minutos tenés un proyecto listo para que un desarrollador humano lo construya.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/discovery")}>HABLAR CON HANDEV AI <ArrowRight size={14} /></Button>
            <Button variant="secondary">CÓMO FUNCIONA</Button>
          </div>
        </div>

        <div className="relative max-w-xs mx-auto mt-12 rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000,0_0_26px_rgba(180,92,240,0.35)] text-left">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-accent to-accent-bright border-b-2 border-black">
            <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-sm bg-white/50" />)}</div>
            <span style={{ fontFamily: F.ui, fontSize: 11 }}>HAND<span className="text-white/90" style={{ display: "inline-block", transform: "translateY(-0.04em)" }}>Ξ</span>V AI</span>
          </div>
          <div className="bg-bg-deep px-4 py-5 min-h-[84px]">
            <span style={{ fontFamily: F.term, fontSize: 20 }} className="text-ink-100">
              <span className="text-accent-glow">▸ </span>{typed}<span className="caret-blink">▍</span>
            </span>
          </div>
        </div>
      </section>

      <ProcessCarousel />

      <section className="px-5 py-16 border-t border-accent/40 text-center">
        <HandevMark size={40} />
        <h2 style={{ fontFamily: F.block, fontSize: "clamp(18px,5vw,24px)", lineHeight: 1.6 }} className="mt-5 mb-4">¿Listo para construir<br />tu idea?</h2>
        <Button className="mx-auto" onClick={() => navigate("/discovery")}>HABLAR CON HANDEV AI <ArrowRight size={14} /></Button>
      </section>

      <footer className="px-5 py-8 border-t border-accent/40 flex items-center justify-between">
        <span style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 tracking-wider">© HANDEV 2026</span>
        <Instagram size={16} className="text-ink-500" />
      </footer>
    </div>
  );
}
