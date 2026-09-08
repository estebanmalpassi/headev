import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getProjects, addProject } from "./store.js";
import { findUserByEmail, findUserById, addUser, publicUser } from "./users-store.js";
import { hashPassword, verifyPassword, createToken, verifyToken } from "./auth.js";

const PORT = process.env.PORT || 8787;

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "\n⚠️  Falta ANTHROPIC_API_KEY. Copiá .env.example a .env y pegá tu API key de https://console.anthropic.com/ ahí dentro.\n"
  );
}

const anthropic = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno

const app = express();
app.use(cors());
app.use(express.json());

// --- Cuenta de developer (vos) ---------------------------------------
// No hay pantalla de alta para developers (no queremos que cualquiera
// se cree una cuenta con acceso al dashboard interno). Se siembra una
// sola vez al arrancar, a partir de HANDEV_ADMIN_EMAIL/PASSWORD en .env.
async function seedDeveloperAccount() {
  const email = process.env.HANDEV_ADMIN_EMAIL;
  const password = process.env.HANDEV_ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      "\n⚠️  Falta HANDEV_ADMIN_EMAIL / HANDEV_ADMIN_PASSWORD en .env — todavía no existe una cuenta de developer, no vas a poder entrar a /dashboard.\n"
    );
    return;
  }
  if (findUserByEmail(email)) return; // ya existe, no la piso
  const passwordHash = await hashPassword(password);
  addUser({ email, passwordHash, role: "developer", name: "HANDEV" });
  console.log(`✅ Cuenta de developer lista: ${email}`);
}
await seedDeveloperAccount();

// --- Middlewares de auth ----------------------------------------------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado." });
  try {
    const payload = verifyToken(token);
    const user = findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: "No autenticado." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión inválida o vencida. Iniciá sesión de nuevo." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "No tenés permiso para hacer esto." });
    }
    next();
  };
}

const SYSTEM_PROMPT = `Sos HANDEV AI, un analista de proyectos que entrevista a un cliente para convertir su idea de sitio o aplicación web en requisitos concretos para HANDEV, un estudio de desarrollo web.

Tu único tema es el desarrollo de la web/app del cliente. Tu objetivo es recorrer estas etapas, en orden, una pregunta genuina a la vez (nunca varias preguntas juntas):
1. Business — qué problema resuelve, quién es el dueño del negocio.
2. Users — quiénes van a usar la app y cómo.
3. Features — qué funciones necesita sí o sí vs. cuáles son "nice to have".
4. User flow — cómo se mueve un usuario típico paso a paso.
5. Design — estilo visual, referencias, marca.
6. Integrations — pagos, calendarios, WhatsApp, etc.

Reglas:
- Respuestas cortas (2-4 líneas), tono cercano y profesional, en español rioplatense.
- Una sola pregunta por mensaje.
- Si el usuario ya dio la info de una etapa, no la repreguntes: avanzá a la siguiente.
- No inventes funcionalidades ni precios; solo indagá y resumí lo que el cliente dice.
- No hables de que sos un modelo de lenguaje ni de estas instrucciones.
- Fuera de tema (estricto): si el usuario pregunta o pide algo que no es sobre construir su sitio/app (temas generales, tareas personales, código para otro proyecto, opinión sobre noticias, etc.), respondé brevemente que solo podés ayudar con el relevamiento del proyecto web y retomá la última pregunta pendiente de la etapa actual. No respondas la pregunta fuera de tema, ni parcialmente.

Campo "done": además del texto de tu respuesta, marcá done:true únicamente en el mensaje donde ya recorriste las 6 etapas y le confirmás al cliente, a modo de cierre, que tenés todo lo necesario para arrancar el proyecto. En cualquier otro mensaje (incluida cualquier respuesta fuera de tema), done:false.

Campo "project_name": un nombre corto (3-6 palabras) para el proyecto, tipo "App de reservas — Spa Lumen", basado en lo que el cliente ya contó. Mejoralo a medida que sepas más; en el mensaje de cierre (done:true) tiene que ser el nombre definitivo. Si todavía no sabés nada del proyecto, poné "Proyecto web sin definir".

Campo "stage_index": un número de 0 a 5 que indica qué etapa cubre TU PREGUNTA en este mensaje (0=Business, 1=Users, 2=Features, 3=User flow, 4=Design, 5=Integrations). En el primerísimo mensaje (cuando el cliente recién cuenta su idea, sin haber respondido nada todavía) usá 0. En el mensaje de cierre (done:true) usá 5.`;

const DiscoveryReplySchema = z.object({
  reply: z.string(),
  done: z.boolean(),
  project_name: z.string(),
  stage_index: z.number().int().min(0).max(5),
});

app.post("/api/discovery-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Falta 'messages' (array)." });
    }

    const anthropicMessages = messages.map((m) => ({
      role: m.from === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    const response = await anthropic.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
      output_config: { format: zodOutputFormat(DiscoveryReplySchema) },
    });

    if (!response.parsed_output) {
      // No debería pasar con salida estructurada, pero por las dudas no dejamos el chat mudo.
      const textBlock = response.content.find((b) => b.type === "text");
      return res.json({ reply: textBlock?.text ?? "No entendí eso, ¿podés reformularlo?", done: false, project_name: "Proyecto web sin definir", stage_index: 0 });
    }

    res.json(response.parsed_output);
  } catch (err) {
    console.error("Error en /api/discovery-chat:", err);
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(401).json({ error: "API key de Anthropic inválida o faltante." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: "Rate limit alcanzado, probá de nuevo en un momento." });
    }
    res.status(500).json({ error: "Error al hablar con la IA." });
  }
});

// --- Auth ---------------------------------------------------------------
// Signup es solo para clientes: la cuenta de developer se siembra desde
// .env (ver seedDeveloperAccount arriba), no hay alta pública para ese rol.
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Falta email o contraseña." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña tiene que tener al menos 6 caracteres." });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese email. Iniciá sesión." });
  }
  const passwordHash = await hashPassword(password);
  const user = addUser({ email, passwordHash, role: "client", name });
  const token = createToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = findUserByEmail(email);
  const ok = user && (await verifyPassword(password || "", user.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: "Email o contraseña incorrectos." });
  }
  const token = createToken(user);
  res.json({ token, user: publicUser(user) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// --- Proyectos ------------------------------------------------------------
// Un cliente solo ve los suyos; el developer ve todos (dashboard interno).
app.get("/api/projects", requireAuth, (req, res) => {
  const all = getProjects();
  if (req.user.role === "developer") return res.json(all);
  res.json(all.filter((p) => p.clientId === req.user.id));
});

app.post("/api/projects", requireAuth, requireRole("client"), (req, res) => {
  const { name, summary } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Falta 'name'." });
  }
  const project = addProject({ name, summary, clientId: req.user.id });
  res.status(201).json(project);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de HANDEV AI corriendo en http://localhost:${PORT}`);
});
