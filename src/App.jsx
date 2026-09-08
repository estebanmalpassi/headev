import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Welcome from "./pages/Welcome";
import DiscoveryChat from "./pages/DiscoveryChat";
import PaymentActivation from "./pages/PaymentActivation";
import ClientPortal from "./pages/ClientPortal";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import Login from "./pages/Login";
import { useAuth } from "./lib/auth";

/* Protege una ruta para un rol puntual ("client" o "developer").
   Sin sesión, o con el rol que no corresponde, manda a /login. */
function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user || user.role !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

/* Barra flotante SOLO para probar las pantallas mientras desarrollás.
   Borrala cuando tengas login/flujo real conectado. */
function DevNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const routes = [
    { path: "/", label: "Welcome" },
    { path: "/discovery", label: "HANDEV" },
    { path: "/activate", label: "Payment" },
    { path: "/portal", label: "Client" },
    { path: "/dashboard", label: "Dev" },
  ];
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-black/80 backdrop-blur border border-accent rounded-full px-2 py-1.5">
      {routes.map((r) => (
        <button
          key={r.path}
          onClick={() => navigate(r.path)}
          style={{ fontFamily: "var(--font-mono)", fontSize: 10.5 }}
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === r.path ? "bg-accent-glow text-void" : "text-ink-300 hover:text-white"}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <>
      {import.meta.env.DEV && <DevNav />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/discovery" element={<DiscoveryChat />} />
        <Route path="/activate" element={<PaymentActivation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<RequireRole role="client"><ClientPortal /></RequireRole>} />
        <Route path="/dashboard" element={<RequireRole role="developer"><DeveloperDashboard /></RequireRole>} />
      </Routes>
    </>
  );
}
