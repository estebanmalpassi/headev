<div align="center">

# Headev

### De una idea a un proyecto real

Un agente de Inteligencia Artificial que transforma tu idea en un proyecto de software concreto.

</div>

---

## ✨ ¿Qué es Headev?

¿Tenés una idea pero no sabés cómo convertirla en una página web, aplicación o sistema?

**Headev** conversa con vos y te hace las preguntas necesarias para entender qué querés crear, cómo debería funcionar, qué características necesitás y cuál es el objetivo de tu proyecto. A medida que respondés, Headev organiza toda la información y genera una definición clara de lo que querés desarrollar.

No necesitás saber programación ni explicar técnicamente cómo construir tu proyecto. **Vos contás qué necesitás. Headev hace las preguntas. Un desarrollador se encarga de convertirlo en realidad.**

## 🚀 ¿Cómo funciona?

| Paso | Descripción |
|---|---|
| 1️⃣ **Contale tu idea** | Explicale a Headev qué querés crear, aunque no tengas todos los detalles definidos. |
| 2️⃣ **Respondé las preguntas** | El agente de IA te hará preguntas específicas para entender tu proyecto. |
| 3️⃣ **Se define el proyecto** | Headev estructura los requerimientos y características de tu proyecto. |
| 4️⃣ **Se prepara el desarrollo** | La información queda lista para que un desarrollador la analice. |
| 5️⃣ **Realizás el pago** | Aprobás el proyecto, pagás, y comienza el desarrollo. |

---

## 🛠️ Stack técnico

Proyecto completo y corrible: **Vite + React + Tailwind + React Router**, con backend propio en **Express** conectado a **Claude (Anthropic API)**.

### Requisitos

- **Node.js 18 o superior**. Si no lo tenés: [nodejs.org](https://nodejs.org) (versión LTS).
- Verificá tu instalación:
  ```bash
  node -v
  npm -v
  ```

### Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
```

Completá en `.env`:
- **`ANTHROPIC_API_KEY`** — tu key de [console.anthropic.com](https://console.anthropic.com/). Sin esto, el chat de `/discovery` mostrará un error.
- **`JWT_SECRET`** — un texto largo al azar. Generalo con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **`HANDEV_ADMIN_EMAIL`** / **`HANDEV_ADMIN_PASSWORD`** — tu login como developer (se crea solo al arrancar el server).

```bash
# 3. Levantar frontend + backend juntos
npm run dev
```

La terminal mostrará:
```
[server] ✅ Servidor de HANDEV AI corriendo en http://localhost:8787
[client] Local:   http://localhost:5173/
```

Abrí `http://localhost:5173/` en el navegador. 🎉

> Al editar archivos en `src/`, la página se actualiza sola (hot reload). Si editás `server/index.js`, reiniciá con Ctrl+C y `npm run dev` de nuevo.

### Rutas de la app

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Welcome | Pública |
| `/discovery` | Chat de descubrimiento con Headev AI | Pública |
| `/activate` | Pago / activación — crea tu cuenta de cliente | Pública |
| `/login` | Iniciar sesión (cliente o developer) | Pública |
| `/portal` | Perfil del cliente + panel de proyectos | Solo cliente logueado |
| `/dashboard` | Developer Command Center | Solo developer logueado |

### Estructura del proyecto

```
handev-app/
├── server/               ← backend Express: Claude + auth + endpoints
├── src/
│   ├── pages/            ← Welcome, DiscoveryChat, PaymentActivation, Login, ClientPortal, DeveloperDashboard
│   ├── components/       ← Logo + UI (Button, Field, Card, StateChip)
│   ├── lib/auth.jsx      ← contexto de sesión
│   └── styles/           ← tokens de marca
├── public/assets/        ← logo
└── .env.example
```

### ✅ Qué ya es real

- Chat de Discovery conectado a Claude de verdad — al terminar, redirige a `/activate` con el resumen del proyecto.
- Login real con contraseñas hasheadas (bcrypt) y sesiones por token (JWT).
- Rutas protegidas por rol (`/portal`, `/dashboard`).
- Los proyectos activados se guardan de verdad y se listan por cliente logueado.

### 🚧 Qué sigue siendo mock

- El pago simula el estado "processing", no cobra de verdad todavía.
- Los datos que muestra el Developer Dashboard (leads, proyectos, stats) siguen siendo de ejemplo.
- Pestañas de "Pagos"/"Mensajes" y opciones de configuración del portal del cliente.

### 📦 Deploy

```bash
npm run build
```

Genera `dist/` con el frontend, listo para Vercel, Netlify, etc.

> ⚠️ Esos hostings solo sirven archivos estáticos — no corren `server/index.js`. Para producción, desplegá el backend aparte (Render, Railway, Fly.io) con las variables de entorno configuradas, y migrá `server/data/*.json` a una base de datos real (Postgres, etc.) antes de tener clientes de verdad.

### 📜 Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Frontend + backend juntos, con hot reload |
| `npm run dev:client` | Solo el frontend (Vite) |
| `npm run dev:server` | Solo el backend (API de Claude) |
| `npm run build` | Build de producción del frontend en `dist/` |
| `npm run preview` | Sirve localmente la build de producción |

---

<div align="center">

**Tu idea. Nuestra tecnología. Un proyecto real.**

</div>
