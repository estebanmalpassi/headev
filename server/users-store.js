import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function getUsers() {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveUsers(users) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email) {
  if (!email) return null;
  const target = email.trim().toLowerCase();
  return getUsers().find((u) => u.email === target) ?? null;
}

export function findUserById(id) {
  return getUsers().find((u) => u.id === id) ?? null;
}

export function addUser({ email, passwordHash, role, name }) {
  const users = getUsers();
  const user = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    email: email.trim().toLowerCase(),
    passwordHash,
    role, // "developer" | "client"
    name: name?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}
