# HANDEV — App

Proyecto completo y corrible: Vite + React + Tailwind + React Router. Las 5 pantallas ya están conectadas por rutas reales.

## Requisitos

- **Node.js 18 o superior** instalado en tu computadora. Si no lo tenés: https://nodejs.org (bajá la versión LTS).
- Para chequear que lo tenés, abrí una terminal y corré:
  ```bash
  node -v
  npm -v
  ```
  Si te devuelve un número de versión en ambos, estás listo.

## Cómo correrlo (paso a paso)

1. **Descomprimí** este proyecto en una carpeta de tu computadora.
2. Abrí una terminal **dentro de esa carpeta** (`cd ruta/a/handev-app`).
3. Instalá las dependencias:
   ```bash
   npm install
   ```
   Esto va a tardar un minuto o dos la primera vez — está bajando React, Tailwind, el router, los íconos y el SDK de Anthropic (Claude).
4. Configurá el `.env`:
   ```bash
   cp .env.example .env
   ```
   Abrí `.env` y completá:
   - `ANTHROPIC_API_KEY`: tu key de https://console.anthropic.com/ (creá una cuenta si no tenés). Sin esto, el chat de `/discovery` va a mostrar un error de "API key inválida o faltante".
   - `JWT_SECRET`: cualquier texto largo al azar (para firmar las sesiones). Generá uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `HANDEV_ADMIN_EMAIL` / `HANDEV_ADMIN_PASSWORD`: tu login como developer. Con esto entrás a `/dashboard` — se crea solo la primera vez que arrancás el server.
5. Levantá todo (servidor de la API + frontend, en un solo comando):
   ```bash
   npm run dev
   ```
6. La terminal te va a mostrar algo como:
   ```
   [server] ✅ Servidor de HANDEV AI corriendo en http://localhost:8787
   [client] Local:   http://localhost:5173/
   ```
   Abrí `http://localhost:5173/` en el navegador. Ahí está la app corriendo.

Cada vez que edites un archivo de `src/` y lo guardes, la página se actualiza sola (hot reload). Si editás `server/index.js`, reiniciá `npm run dev` (Ctrl+C y volver a correrlo).

## Qué vas a ver

Arriba de todo hay una **barra flotante negra** con 5 botones (Welcome / HANDEV / Payment / Client / Dev) para saltar entre pantallas mientras probás. Es solo para desarrollo — no aparece en producción (`import.meta.env.DEV`, ver `src/App.jsx`, componente `DevNav`).

Las rutas reales son:

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Welcome (pantalla de bienvenida) | Pública |
| `/discovery` | Chat de descubrimiento con HANDEV AI | Pública |
| `/activate` | Pantalla de pago / activación ($20) — crea tu cuenta de cliente acá | Pública |
| `/login` | Iniciar sesión (cliente o developer) | Pública |
| `/portal` | Perfil del cliente + panel de proyectos | Solo cliente logueado (si no, redirige a `/login`) |
| `/dashboard` | Developer Command Center | Solo developer logueado (si no, redirige a `/login`) |

## Estructura del proyecto

```
handev-app/
├── index.html
├── package.json
├── vite.config.js            ← proxy /api → servidor local (puerto 8787)
├── tailwind.config.js       ← tokens de marca (colores, fuentes, sombras)
├── postcss.config.js
├── .env.example               ← copiar a .env con tu ANTHROPIC_API_KEY
├── public/assets/            ← logo real (PNG)
├── server/
│   ├── index.js                ← backend Express: Claude + auth + endpoints de proyectos
│   ├── auth.js                  ← hash de contraseñas + tokens (JWT)
│   ├── store.js                 ← persistencia de proyectos (archivo JSON)
│   ├── users-store.js           ← persistencia de usuarios (archivo JSON)
│   └── data/                    ← projects.json, users.json — se generan solos (.gitignore)
├── src/
│   ├── main.jsx               ← entry point + router + AuthProvider
│   ├── App.jsx                ← rutas + protección por rol
│   ├── index.css              ← importa tokens + Tailwind
│   ├── styles/tokens.css      ← fuentes pixel + variables CSS
│   ├── lib/auth.jsx            ← contexto de sesión (useAuth)
│   ├── components/
│   │   ├── logo/HandevLogo.jsx
│   │   └── ui/ (Button, Field, Card, StateChip)
│   └── pages/
│       ├── Welcome.jsx
│       ├── DiscoveryChat.jsx
│       ├── PaymentActivation.jsx
│       ├── Login.jsx
│       ├── ClientPortal.jsx
│       └── DeveloperDashboard.jsx
```

## Qué es real y qué es "de mentira" todavía

Ya conectado a un backend real (ver `server/`):

- El chat de Discovery (`/discovery`) llama a Claude de verdad, y cuando termina el relevamiento (`done: true`) redirige solo a `/activate`, pasándole el nombre y resumen del proyecto que salieron de la conversación.
- **Login real** con contraseñas hasheadas (bcrypt) y sesiones por token (JWT):
  - **Cliente**: la cuenta se crea sola en `/activate`, al activar tu primer proyecto (email + contraseña). Si ya tenías cuenta con ese email, te loguea en vez de duplicarla.
  - **Developer**: una única cuenta, sembrada desde `HANDEV_ADMIN_EMAIL`/`HANDEV_ADMIN_PASSWORD` en `.env` — no hay alta pública para este rol.
  - `/portal` y `/dashboard` están protegidas: sin sesión (o con el rol que no corresponde), `App.jsx` te redirige a `/login`.
- Al "activar" el proyecto en `/activate`, se guarda de verdad en `server/data/projects.json` (vía `POST /api/projects`), asociado a tu cuenta (`clientId`).
- El Portal de Cliente (`/portal`, pestaña "Proyectos") ya no muestra los dos proyectos de ejemplo (`Spa Lumen`, `Landing de campaña`): lista **tus** proyectos reales (`GET /api/projects` filtra por el cliente logueado). Si todavía no activaste ninguno, muestra un estado vacío. El Developer Dashboard, en cambio, vería todos los proyectos de todos los clientes con ese mismo endpoint (la UI del dashboard todavía no está cableada a esto — ver abajo).

Lo que sigue siendo mock:

- El pago (`PaymentActivation.jsx`) simula el estado "processing" con un `setTimeout`, no cobra nada de verdad (el proyecto sí se guarda igual, aunque no se haya cobrado nada real).
- Los leads, proyectos y pagos que se **ven** en el Developer Dashboard (`LEADS`, `PROJECTS`, `STATS`) siguen siendo arrays hardcodeados — aunque la ruta ya está protegida con login real, el contenido que muestra todavía es de mentira. Lo mismo con las pestañas "Pagos"/"Mensajes" y las opciones de "Editar datos personales"/"Método de pago"/"Notificaciones" del portal del cliente.

Cuando quieras seguir conectando backend real, esos son los puntos exactos donde reemplazar mock data por llamadas a tu API.

## Deploy (cuando quieras publicarlo)

```bash
npm run build
```
Esto genera una carpeta `dist/` con el **frontend**, lista para subir a Vercel, Netlify, o cualquier hosting estático.

⚠️ Esos hostings solo sirven archivos estáticos: **no corren `server/index.js`**. Para que `/discovery`, el login y `/portal`/`/dashboard` funcionen en producción, desplegá `server/index.js` aparte (Render, Railway, Fly.io, una función serverless, etc.) con `ANTHROPIC_API_KEY`, `JWT_SECRET`, `HANDEV_ADMIN_EMAIL` y `HANDEV_ADMIN_PASSWORD` configuradas ahí (un `JWT_SECRET` distinto al de tu compu), y apuntá el proxy/URL del frontend a esa dirección en vez de `localhost:8787`.

⚠️ Además, `server/data/*.json` (usuarios y proyectos) es un archivo en el disco del server — funciona bien para probar, pero no sobrevive a un redeploy en la mayoría de los hostings sin disco persistente, y no está pensado para tráfico concurrente real. Antes de tener clientes de verdad, migrá esto a una base de datos (Postgres, etc.).

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Corre **frontend + backend** juntos, con hot reload |
| `npm run dev:client` | Corre solo el frontend (Vite) |
| `npm run dev:server` | Corre solo el backend (API de Claude) |
| `npm run build` | Genera la versión de producción del frontend en `dist/` |
| `npm run preview` | Sirve localmente la build de producción, para probarla antes de publicar |
