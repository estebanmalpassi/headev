import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, Target, CreditCard, MessageSquare, ListChecks,
  FileText, Wrench, Search, Bell, ChevronRight,
} from "lucide-react";
import { HandevMark } from "../components/logo/HandevLogo";
import { useAuth } from "../lib/auth";

const F = { block: "'Press Start 2P', monospace", ui: "'Silkscreen', monospace", mono: "'JetBrains Mono', monospace" };

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Proyectos", count: 12 },
  { icon: Users, label: "Clientes", count: 28 },
  { icon: Target, label: "Leads", count: 4 },
  { icon: CreditCard, label: "Pagos" },
  { icon: MessageSquare, label: "Conversaciones", count: 3 },
  { icon: ListChecks, label: "Tareas", count: 7 },
  { icon: FileText, label: "Propuestas" },
  { icon: Wrench, label: "Mantenimiento" },
];
const STATS = [
  { label: "Proyectos activos", value: "12", trend: "+2 esta semana" },
  { label: "Leads nuevos", value: "4", trend: "sin revisar" },
  { label: "MRR mantenimiento", value: "$1,204", trend: "+$80 vs. mes pasado" },
  { label: "Pendiente revisión", value: "3", trend: "acción requerida", warn: true },
];
const PROJECTS = [
  { name: "App de reservas — Spa Lumen", client: "Spa Lumen", status: "ACTIVE", state: "success", updated: "hace 2h" },
  { name: "Marketplace artesanal", client: "Cendia Studio", status: "REVIEW", state: "warning", updated: "hace 5h" },
  { name: "CRM interno", client: "Estudio Fértil", status: "DISCOVERY", state: "info", updated: "hace 1d" },
  { name: "Landing + checkout", client: "Norte Cafetería", status: "ACTIVE", state: "success", updated: "hace 1d" },
  { name: "App de turnos médicos", client: "Clínica Vera", status: "PAUSED", state: "error", updated: "hace 3d" },
];
const LEADS = [
  { name: "Marina Ríos", project: "App de delivery local", time: "12 min" },
  { name: "Tomás Ibarra", project: "Sistema de inventario", time: "48 min" },
  { name: "Studio Nix", project: "Rediseño e-commerce", time: "3h" },
  { name: "Valentina Paz", project: "App de turnos", time: "6h" },
];
const STATE_STYLE = {
  success: "bg-success/10 text-[#8FF0B8] border-success",
  warning: "bg-warning/10 text-[#FDCB7E] border-warning",
  info: "bg-info/10 text-[#A9C2F7] border-info",
  error: "bg-error/10 text-[#FBA3AC] border-error",
};

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Proyectos");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-void text-white">
      <aside className="w-60 shrink-0 border-r border-accent/60 bg-bg-elevated-2/10 flex flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-accent/60">
          <HandevMark size={22} />
          <span style={{ fontFamily: F.block, fontSize: 11 }}>HAND<span className="text-accent-glow" style={{ display: "inline-block", transform: "translateY(-0.32em)" }}>Ξ</span>V</span>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button key={item.label} onClick={() => setActiveNav(item.label)} className={`w-full flex items-center justify-between px-5 py-2.5 text-[13px] border-l-2 transition-colors ${isActive ? "border-accent-glow bg-accent-glow/10 text-white" : "border-transparent text-ink-500 hover:text-white hover:bg-white/5"}`}>
                <span className="flex items-center gap-2.5"><item.icon size={15} />{item.label}</span>
                {item.count != null && <span style={{ fontFamily: F.mono }} className={`text-[10.5px] px-1.5 rounded ${isActive ? "bg-accent-glow text-void" : "bg-white/10 text-ink-500"}`}>{item.count}</span>}
              </button>
            );
          })}
        </nav>
        <button onClick={handleLogout} title="Cerrar sesión" className="px-5 py-4 border-t border-accent/60 flex items-center gap-2.5 text-left hover:bg-white/5">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center" style={{ fontFamily: F.mono, fontSize: 12 }}>
            {(user?.name || user?.email || "?").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-medium truncate">{user?.name || user?.email}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10 }} className="text-ink-500">DEVELOPER · SALIR</div>
          </div>
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-accent/60 bg-bg-elevated-2/10">
          <div className="flex items-center gap-2 text-ink-500 bg-void border border-accent/60 rounded px-3 py-1.5 w-72">
            <Search size={14} />
            <input placeholder="Buscar proyecto, cliente..." className="bg-transparent outline-none text-[13px] text-white placeholder:text-ink-500 flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: F.mono, fontSize: 11 }} className="text-ink-500">COMMAND CENTER</span>
            <Bell size={16} className="text-ink-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="grid grid-cols-4 gap-px bg-accent/50 rounded overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="bg-void p-4">
                <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24 }} className="text-white">{s.value}</div>
                <div style={{ fontFamily: F.mono, fontSize: 10.5 }} className="uppercase text-ink-500 tracking-wide mt-1">{s.label}</div>
                <div style={{ fontFamily: F.mono, fontSize: 10 }} className={`mt-1.5 ${s.warn ? "text-warning" : "text-success"}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 rounded-lg border border-accent/60 bg-bg-elevated-2/10 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-accent/60">
                <span style={{ fontFamily: F.ui, fontSize: 13 }}>PROYECTOS</span>
                <span style={{ fontFamily: F.mono, fontSize: 11 }} className="text-ink-500 flex items-center gap-1 cursor-pointer hover:text-white">Ver todos <ChevronRight size={13} /></span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500 uppercase border-b border-white/5">
                    <th className="px-5 py-2.5 font-normal">Proyecto</th>
                    <th className="px-3 py-2.5 font-normal">Cliente</th>
                    <th className="px-3 py-2.5 font-normal">Estado</th>
                    <th className="px-3 py-2.5 font-normal">Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.map((p) => (
                    <tr key={p.name} className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer">
                      <td className="px-5 py-3 text-[13px] font-medium">{p.name}</td>
                      <td className="px-3 py-3 text-[12.5px] text-ink-300">{p.client}</td>
                      <td className="px-3 py-3"><span style={{ fontFamily: F.mono, fontSize: 10.5 }} className={`px-2 py-0.5 rounded border ${STATE_STYLE[p.state]}`}>{p.status}</span></td>
                      <td className="px-3 py-3 text-[12px] text-ink-500" style={{ fontFamily: F.mono }}>{p.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/10 overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 border-b border-accent/60"><span style={{ fontFamily: F.ui, fontSize: 13 }}>LEADS RECIENTES</span></div>
              <div className="flex-1 divide-y divide-white/5">
                {LEADS.map((l) => (
                  <div key={l.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] cursor-pointer">
                    <div>
                      <div className="text-[13px] font-medium">{l.name}</div>
                      <div className="text-[12px] text-ink-500">{l.project}</div>
                    </div>
                    <span style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500">{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-accent/60 bg-bg-elevated-2/10 px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: F.ui, fontSize: 13 }}>TAREAS DE HOY</span>
              <span style={{ fontFamily: F.mono, fontSize: 10.5 }} className="text-ink-500">7 pendientes</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Revisar propuesta — Marketplace artesanal", "Responder lead: Marina Ríos", "Deploy staging — Spa Lumen", "Enviar factura mantenimiento — Norte Cafetería"].map((t) => (
                <label key={t} className="flex items-center gap-2.5 text-[12.5px] text-ink-300 cursor-pointer">
                  <span className="w-4 h-4 rounded-sm border border-accent flex items-center justify-center shrink-0" />
                  {t}
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
