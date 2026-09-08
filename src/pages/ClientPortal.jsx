import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, ChevronRight, Circle, Clock, CreditCard, FolderKanban, MessageSquare, User } from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";
import { useAuth } from "../lib/auth";

const F = { block: "'Press Start 2P', monospace", mono: "'JetBrains Mono', monospace" };

function timeAgo(iso) {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "recién";
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `hace ${diffHr}h`;
  return `hace ${Math.floor(diffHr / 24)}d`;
}

const TABS = [
  { id: "projects", label: "Proyectos", icon: FolderKanban },
  { id: "messages", label: "Mensajes", icon: MessageSquare },
  { id: "billing", label: "Pagos", icon: CreditCard },
  { id: "profile", label: "Perfil", icon: User },
];

const STATE_STYLE = {
  success: "bg-success/10 text-[#8FF0B8] border-success",
  warning: "bg-warning/10 text-[#FDCB7E] border-warning",
};

export default function ClientPortal() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [openProjectId, setOpenProjectId] = useState(null);

  useEffect(() => {
    fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setOpenProjectId(data[0]?.id ?? null);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const openProject = projects.find((p) => p.id === openProjectId) ?? null;

  return (
    <div className="min-h-screen bg-void text-white pb-20">
      <header className="flex items-center justify-between px-5 py-4 border-b border-accent/60 bg-bg-elevated-2/10 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <HandevMark size={22} />
          <span style={{ fontFamily: F.block, fontSize: 11 }}>HAND<span className="text-accent-glow" style={{ display: "inline-block", transform: "translateY(-0.32em)" }}>Ξ</span>V</span>
        </div>
        <Bell size={17} className="text-ink-500" />
      </header>

      {tab === "projects" && (
        <>
          <div className="px-5 pt-5 pb-3">
            <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow mb-3">MIS PROYECTOS</div>

            {loadingProjects && (
              <div style={{ fontFamily: F.mono, fontSize: 12 }} className="text-ink-500">Cargando proyectos...</div>
            )}

            {!loadingProjects && projects.length === 0 && (
              <div className="rounded-lg border border-dashed border-accent/60 bg-bg-elevated-2/5 p-5 text-center">
                <p className="text-[13.5px] text-ink-300 mb-1">Todavía no activaste ningún proyecto.</p>
                <p style={{ fontFamily: F.mono, fontSize: 11 }} className="text-ink-500">Completá el chat de Discovery y activalo para verlo acá.</p>
              </div>
            )}

            {!loadingProjects && projects.length > 0 && (
              <div className="space-y-3">
                {projects.map((p) => (
                  <button key={p.id} onClick={() => setOpenProjectId(p.id)} className={`w-full text-left rounded-lg border p-4 transition-colors ${openProjectId === p.id ? "border-accent-glow bg-bg-surface" : "border-accent/60 bg-bg-elevated-2/5"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-medium">{p.name}</span>
                      <span style={{ fontFamily: F.mono, fontSize: 10 }} className={`px-2 py-0.5 rounded border ${STATE_STYLE[p.state]}`}>{p.status}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                      <div className="h-full bg-accent-glow" style={{ width: `${p.pct}%` }} />
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 mt-1.5">{p.pct}% completado</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {openProject && (
            <div className="px-5 pt-2">
              <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow mb-3">ACTIVIDAD · {openProject.name.toUpperCase()}</div>
              <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/5 divide-y divide-white/5">
                {openProject.updates.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                    <span className="mt-0.5 shrink-0">
                      {u.type === "done" ? <Check size={15} className="text-success" /> : <Circle size={9} className="text-accent-glow fill-accent-glow mt-1" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-[13.5px] text-ink-100">{u.text}</div>
                      <div style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 mt-0.5 flex items-center gap-1"><Clock size={10} /> {timeAgo(u.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "billing" && (
        <div className="px-5 pt-5">
          <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow mb-3">PAGOS</div>
          <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/5 divide-y divide-white/5">
            {[
              { d: "App de reservas — Spa Lumen", a: "$20.00", s: "Activación", date: "12 ago" },
              { d: "Landing de campaña", a: "$20.00", s: "Activación", date: "18 ago" },
              { d: "Mantenimiento mensual — Spa Lumen", a: "$40.00", s: "Suscripción", date: "01 ago" },
            ].map((r) => (
              <div key={r.d} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <div className="text-[13px]">{r.d}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500">{r.s} · {r.date}</div>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 13 }} className="text-white">{r.a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="px-5 pt-5">
          <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow mb-3">MENSAJES</div>
          <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/5 p-4">
            <p className="text-[13.5px] text-ink-300">Tu conversación con el developer sobre "Spa Lumen" va a aparecer acá.</p>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="px-5 pt-5">
          <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: 2 }} className="text-accent-glow mb-3">PERFIL</div>
          <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/5 p-5 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center" style={{ fontFamily: F.mono, fontSize: 16 }}>
              {(user?.name || user?.email || "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-[15px] font-medium">{user?.name || "Sin nombre"}</div>
              <div style={{ fontFamily: F.mono, fontSize: 11 }} className="text-ink-500">{user?.email}</div>
            </div>
          </div>
          <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/5 divide-y divide-white/5">
            {["Editar datos personales", "Método de pago", "Notificaciones"].map((o) => (
              <button key={o} className="w-full flex items-center justify-between px-4 py-3.5 text-[13.5px] text-ink-100">
                {o} <ChevronRight size={14} className="text-ink-500" />
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3.5 text-[13.5px] text-error">
              Cerrar sesión <ChevronRight size={14} className="text-error/70" />
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 inset-x-0 border-t-2 border-black bg-void flex">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 ${tab === t.id ? "text-accent-glow" : "text-ink-500"}`}>
            <t.icon size={18} />
            <span style={{ fontFamily: F.mono, fontSize: 9.5 }} className="uppercase">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
