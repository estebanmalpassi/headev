import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Check, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { useAuth } from "../lib/auth";

const F = { block: "'Press Start 2P', monospace", ui: "'Silkscreen', monospace", mono: "'JetBrains Mono', monospace" };
const CHECKLIST = ["Negocio", "Usuarios", "Funcionalidades", "Flujo de uso", "Diseño", "Integraciones"];

function FlowStep({ label, done, active }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className={`w-7 h-7 rounded flex items-center justify-center border-2 border-black text-[11px] ${done ? "bg-success text-void" : active ? "bg-accent-glow text-void" : "bg-bg-deep text-ink-500"}`}>
        {done ? <Check size={13} /> : <Lock size={12} />}
      </div>
      <span style={{ fontFamily: F.mono, fontSize: 8.5, letterSpacing: 0.5 }} className={`uppercase text-center ${done || active ? "text-white" : "text-ink-500"}`}>{label}</span>
    </div>
  );
}
function FlowLine({ done }) { return <div className={`h-0.5 flex-1 mb-4 ${done ? "bg-success" : "bg-accent"}`} />; }

export default function PaymentActivation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectName, summary } = location.state || {};
  const { user, token, login } = useAuth();
  const [step, setStep] = useState("locked");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountError, setAccountError] = useState(null);

  // Si ya hay sesión iniciada, listo. Si no, crea la cuenta con lo que
  // tipeó; si ese email ya existe, prueba loguearlo con esa misma
  // contraseña (cubre al cliente que vuelve y no se acuerda que ya tenía cuenta).
  async function ensureAccount() {
    if (token) return token;

    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const signupData = await signupRes.json();
    if (signupRes.ok) {
      login(signupData.token, signupData.user);
      return signupData.token;
    }

    if (signupRes.status === 409) {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        login(loginData.token, loginData.user);
        return loginData.token;
      }
      throw new Error("Ya existe una cuenta con ese email. Si es tuya, iniciá sesión con tu contraseña real.");
    }

    throw new Error(signupData.error || "No se pudo crear la cuenta.");
  }

  function handlePay() {
    setAccountError(null);
    if (!token && (!email.trim() || password.length < 6)) {
      setAccountError("Completá un email y una contraseña de al menos 6 caracteres para crear tu cuenta.");
      return;
    }
    setStep("processing");
    (async () => {
      try {
        const authToken = await ensureAccount();
        await new Promise((resolve) => setTimeout(resolve, 1600)); // simula el pago
        const projectRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
          body: JSON.stringify({
            name: projectName || "Proyecto web (activado sin discovery)",
            summary: summary || "",
          }),
        });
        if (!projectRes.ok) {
          const data = await projectRes.json().catch(() => ({}));
          throw new Error(data.error || "No se pudo activar el proyecto.");
        }
        setStep("activated");
      } catch (err) {
        setAccountError(err.message || "Algo falló al activar el proyecto. Probá de nuevo.");
        setStep("locked");
      }
    })();
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-void px-5 py-8">
      <div className="flex items-center gap-2.5 mb-8">
        <HandevMark size={24} />
        <span style={{ fontFamily: F.block, fontSize: 13 }} className="text-white">HAND<span className="text-accent-glow" style={{ display: "inline-block", transform: "translateY(-0.32em)" }}>Ξ</span>V</span>
      </div>

      <div className="flex items-center gap-2 mb-8 max-w-sm w-full">
        <FlowStep label="AI DISCOVERY" done />
        <FlowLine done />
        <FlowStep label="ACTIVATION" done={step !== "locked"} active={step === "locked"} />
        <FlowLine done={step === "activated"} />
        <FlowStep label="HUMAN DEV" done={step === "activated"} />
      </div>

      {step !== "activated" ? (
        <div className="w-full max-w-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_#000,0_0_28px_rgba(180,92,240,0.35)] bg-void overflow-hidden">
          <div className="px-6 py-5 border-b border-dashed border-white/15">
            <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-success mb-3 flex items-center gap-1.5">
              <Check size={13} /> AI DISCOVERY COMPLETED
            </div>
            <ul style={{ fontFamily: F.mono, fontSize: 14 }} className="grid grid-cols-2 gap-y-1.5 text-ink-300">
              {CHECKLIST.map((c) => <li key={c} className="flex items-center gap-1.5"><Check size={12} className="text-success" /> {c}</li>)}
            </ul>
          </div>
          <div className="px-6 py-6 text-center">
            <div style={{ fontFamily: F.ui, fontSize: 13, letterSpacing: 1 }} className="flex items-center justify-center gap-2 text-white mb-1">
              <Lock size={14} /> PROJECT ACTIVATION
            </div>
            <div style={{ fontFamily: F.block, fontSize: 40 }} className="text-accent-glow my-4">$20</div>
            <p className="text-[13.5px] text-ink-300 mb-6 max-w-xs mx-auto leading-relaxed">
              Estos $20 <b className="text-white">no son el precio del desarrollo.</b> Es lo que activa tu proyecto para que un desarrollador humano lo revise personalmente.
            </p>

            {user ? (
              <p style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 mb-4">
                Activando como <span className="text-white">{user.name || user.email}</span>
              </p>
            ) : (
              step === "locked" && (
                <div className="flex flex-col gap-3 mb-5 text-left">
                  <p style={{ fontFamily: F.mono, fontSize: 10.5, letterSpacing: 1 }} className="text-ink-500 uppercase text-center mb-1">
                    Creá tu cuenta para ver tu proyecto
                  </p>
                  <Field label="Tu nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} className="max-w-none" />
                  <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-none" />
                  <Field label="Contraseña (mín. 6 caracteres)" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="max-w-none" />
                </div>
              )
            )}

            {accountError && <p className="text-[12.5px] text-error mb-4">{accountError}</p>}

            {step === "locked" && <Button className="w-full" onClick={handlePay}><CreditCard size={14} /> ACTIVATE PROJECT</Button>}
            {step === "processing" && <Button className="w-full" disabled><Loader2 size={14} className="animate-spin" /> PROCESSING…</Button>}
            <div style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 mt-4">PERSONAL DEVELOPER REVIEW · NO SUBSCRIPTION</div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_#000,0_0_28px_rgba(52,217,122,0.35)] bg-void overflow-hidden text-center px-6 py-8">
          <div style={{ fontFamily: F.block, fontSize: 15 }} className="text-success mb-5">PROJECT ACTIVATED</div>
          <ul style={{ fontFamily: F.mono, fontSize: 14.5 }} className="text-ink-100 space-y-2 mb-7 text-left inline-block">
            <li className="flex items-center gap-2"><Check size={14} className="text-success" /> AI analysis completed</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-success" /> Requirements collected</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-success" /> Developer notified</li>
          </ul>
          <div className="pt-5 border-t border-dashed border-white/15">
            <div style={{ fontFamily: F.mono, fontSize: 10.5, letterSpacing: 2 }} className="text-ink-500 mb-1.5">NEXT</div>
            <div style={{ fontFamily: F.ui, fontSize: 14 }} className="text-white mb-5">PERSONAL CONSULTATION</div>
            <Button className="w-full" onClick={() => navigate("/portal")}>VER MI PROYECTO <ArrowRight size={14} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
