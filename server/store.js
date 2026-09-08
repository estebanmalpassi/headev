import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Persistencia mínima en un archivo JSON local. Cada proyecto queda
// asociado a un clientId (ver server/users-store.js + server/auth.js).
// El día que esto crezca de verdad, esto pasa a una base de datos real
// (Postgres, etc.) — la forma de los datos ya está pensada para eso.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function getProjects() {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function addProject({ name, summary, clientId }) {
  ensureStore();
  const projects = getProjects();
  const now = new Date().toISOString();
  const project = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    clientId,
    name: name?.trim() || "Proyecto web (sin nombre)",
    summary: summary?.trim() || "",
    status: "EN REVISIÓN",
    state: "warning",
    pct: 10,
    createdAt: now,
    updates: [
      { text: "Proyecto activado — relevamiento con HANDEV AI completado", time: now, type: "done" },
    ],
  };
  projects.unshift(project);
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
  return project;
}
