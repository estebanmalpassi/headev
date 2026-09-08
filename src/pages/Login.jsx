import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { useAuth } from "../lib/auth";

const F = { block: "'Press Start 2P', monospace", mono: "'JetBrains Mono', monospace" };

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar sesión.");
      login(data.token, data.user);
      const from = location.state?.from;
      navigate(from?.pathname || (data.user.role === "developer" ? "/dashboard" : "/portal"), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-void px-5">
      <div className="flex items-center gap-2.5 mb-8">
        <HandevMark size={26} />
        <span style={{ fontFamily: F.block, fontSize: 14 }} className="text-white">HAND<span className="text-accent-glow" style={{ display: "inline-block", transform: "translateY(-0.32em)" }}>Ξ</span>V</span>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border-2 border-black shadow-hard bg-bg-surface p-6 flex flex-col gap-4">
        <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow text-center mb-1">
          INICIAR SESIÓN
        </div>

        <Field label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-none" />
        <Field label="Contraseña" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="max-w-none" />

        {error && <p className="text-[12.5px] text-error">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
          {loading ? "ENTRANDO..." : "ENTRAR"}
        </Button>

        <p style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 text-center leading-relaxed">
          ¿Sos cliente y todavía no tenés cuenta? Se crea sola cuando activás tu primer proyecto en{" "}
          <button type="button" onClick={() => navigate("/discovery")} className="text-accent-glow underline underline-offset-2">
            el chat de discovery
          </button>.
        </p>
      </form>
    </div>
  );
}
