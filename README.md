# Gesty — Prototipo funcional

Prototipo del trabajo de grado **"Prototipo de aplicación web para gestión de
procesos académicos y administrativos de la comunidad bonaventuriana"**
(Universidad de San Buenaventura, Cartagena — Ingeniería Multimedia).

Este prototipo replica la interfaz definida en el diseño de Figma para ser
usado en una validación de usabilidad (Think Aloud + escala SUS). **Solo una
función tiene lógica real de extremo a extremo: la reserva de salones.**
Todas las demás pantallas (comunicación institucional, solicitud de equipos,
inscripción a cursos de bienestar, login, registro, perfil, horario, etc.)
son navegables pero no guardan ni procesan datos.

## Alcance

| Módulo | Estado |
|---|---|
| Reserva de salas | **Funcional** (formulario → SQLite → lista de espera → aprobación/denegación) |
| Comunicación institucional / notificaciones | Estático |
| Chat | Estático |
| Horario de clases | Estático |
| Cursos de bienestar | Estático |
| Login / Registro / Perfil | Estático (sin autenticación real) |

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + React Router + lucide-react.
- **Backend:** Node.js + Express, usando el módulo nativo `node:sqlite`
  (incluido en Node desde la versión 22.5 — **no requiere compilación nativa
  ni instalar Python/Visual Studio Build Tools**, a diferencia de librerías
  como `better-sqlite3`).
- **Base de datos:** SQLite, archivo local `server/gesty.db`, creado
  automáticamente a partir de `server/schema.sql` la primera vez que arranca
  el servidor.

## Requisitos

- **Node.js 22.5 o superior** (se probó con Node 24 LTS). Verifica con:

  ```bash
  node -v
  ```

  Si no lo tienes instalado: <https://nodejs.org> (elige la versión LTS).

## Instalación

Desde la raíz del proyecto (`gesty/`):

```bash
npm run install:all
```

Esto instala las dependencias del backend (`server/`) y del frontend
(`client/`).

## Ejecutar en desarrollo

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto levanta **ambos** procesos a la vez (usando `concurrently`):

- API en `http://localhost:4000`
- Frontend (Vite) en `http://localhost:5173`

Abre `http://localhost:5173` en el navegador. El frontend está configurado
para redirigir automáticamente las peticiones `/api/*` al backend
(`client/vite.config.js`), así que no hay que configurar CORS a mano ni usar
una URL distinta.

También puedes levantar cada proceso por separado desde la raíz:

```bash
npm run dev:server   # solo la API (puerto 4000)
npm run dev:client   # solo el frontend (puerto 5173)
```

## Base de datos

El esquema vive en [`server/schema.sql`](server/schema.sql) y replica el
**modelo entidad-relación completo** definido para el trabajo de grado (11
entidades: `usuario`, `administrativo`, `sala`, `reserva`, `horario`,
`detalle_horario`, `asignatura`, `comunidad`, `miembro_comunidad`,
`mensaje`, `curso_bienestar`, `inscripcion_bienestar`). De ese modelo, el
prototipo ejecuta lógica real solo sobre `usuario`, `sala`, `reserva` y
`administrativo` (el flujo de Reserva de Salas); las demás tablas existen
para que el esquema sea fiel al diseño aunque sus pantallas todavía sean
estáticas en el cliente.

Al arrancar el servidor por primera vez se crea `server/gesty.db` y se
siembran automáticamente tres usuarios de referencia (`Estudiante`,
`Docente`, `Administrativo`) y el catálogo de `sala` — son los perfiles que
simula el selector de la pantalla de Reserva de Salas (no hay login real).

Las tablas centrales del flujo funcional:

```sql
CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  correo_institucional TEXT NOT NULL UNIQUE,
  contrasena TEXT NOT NULL,
  nombre_usuario TEXT NOT NULL UNIQUE,
  fecha_nacimiento TEXT,
  foto_perfil TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('Estudiante', 'Docente', 'Administrativo')),
  fecha_registro TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE administrativo (
  id_administrativo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario (id_usuario)
);

CREATE TABLE sala (
  id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  bloque TEXT NOT NULL,
  capacidad INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'No disponible'))
);

CREATE TABLE reserva (
  id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT NOT NULL,
  motivo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente'
    CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada', 'Cancelada')),
  fecha_solicitud TEXT NOT NULL DEFAULT (datetime('now')),
  id_usuario INTEGER NOT NULL REFERENCES usuario (id_usuario),
  id_sala INTEGER NOT NULL REFERENCES sala (id_sala),
  id_administrativo INTEGER REFERENCES administrativo (id_administrativo)
);
```

Si quieres reiniciar los datos de prueba, borra `server/gesty.db` (se vuelve
a crear y a sembrar en el siguiente arranque del servidor).

## Cómo probar la reserva de salas

1. Ve a **Reserva de Salas** en el menú lateral (`/app/reservas`).
2. Arriba del formulario hay un selector de **Perfil simulado
   (`USUARIO.rol`)**: alterna entre **Docente** y **Administrativo**. No hay
   login real — este selector solo cambia qué puede ver y hacer cada rol,
   tal como lo pide la regla de negocio ("solo docentes o administrativos
   pueden reservar espacios"), y el servidor revalida el rol contra la fila
   real de `usuario` en cada escritura.
3. Como **Docente**: completa Bloque, Salón, Motivo, Fecha y Hora, y envía
   la solicitud. Aparece de inmediato en el panel derecho **Estado de
   Reservas** con estado **"Pendiente"**, guardada en `server/gesty.db`. El
   Docente puede **cancelar** sus propias solicitudes pendientes.
4. Cambia el perfil a **Administrativo**: ahí se ven **todas** las
   solicitudes de todos los usuarios, con botones **Aprobar** / **Rechazar**
   sobre las que están pendientes. Al resolverlas, queda registrado en
   `reserva.id_administrativo` quién las gestionó, y el estado se refleja
   para ambos perfiles.

## API (backend)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/perfiles-demo` | Perfiles `Docente` y `Administrativo` sembrados en `usuario` (alimenta el selector de perfil simulado). |
| `GET` | `/api/salas` | Catálogo de salas con `estado = 'Disponible'` (llena los selects del formulario). |
| `GET` | `/api/reservas?rol=Administrativo` | Lista todas las solicitudes (vista de administrativo). |
| `GET` | `/api/reservas?id_usuario=<id>` | Lista solo las solicitudes de ese usuario (vista de docente). |
| `POST` | `/api/reservas` | Crea una solicitud con estado `Pendiente`. Rechaza (403/404) si el `id_usuario` no existe o su `rol` no es `Docente`/`Administrativo`. |
| `PATCH` | `/api/reservas/:id` | Actualiza `estado`: `Aprobada`/`Rechazada` (solo si `id_usuario` es un `Administrativo`) o `Cancelada` (solo el usuario dueño de la solicitud). |

## Estructura del proyecto

```
gesty/
├── client/              # Frontend React + Vite + Tailwind
│   └── src/
│       ├── pages/        # Una pantalla del prototipo por archivo
│       ├── components/   # Sidebar, AppShell, ScheduleGrid, etc.
│       └── data/         # Datos estáticos de las pantallas de solo lectura
├── server/               # Backend Express + SQLite
│   ├── schema.sql         # Modelo entidad-relación completo (11 tablas)
│   ├── db.js               # Conexión SQLite + siembra de usuario/sala/administrativo
│   └── index.js             # Rutas de la API (reserva de salas)
└── package.json          # Scripts raíz (dev, install:all)
```

## Despliegue en producción

`npm run build` compila el frontend a `client/dist`, y en producción el
propio backend Express sirve esos archivos estáticos además de la API — todo
queda bajo un solo servicio, un solo dominio y sin configurar CORS:

```bash
npm run build   # instala dependencias y compila client/dist
npm start       # arranca el servidor de produccion (usa PORT del entorno, 4000 por defecto)
```

Ver la guía de despliegue gratuito en [`DEPLOY.md`](DEPLOY.md).

## Limitaciones conocidas

- El selector de **Perfil simulado** (Docente/Administrativo) en la pantalla
  de Reserva de Salas no aparece en las capturas de Figma provistas; se
  agregó porque es un requisito funcional explícito del encargo (regla de
  negocio de quién puede reservar y quién aprueba).
- No hay autenticación real en ninguna pantalla (login, registro, cambio de
  perfil): es intencional, según el alcance definido.
- El esquema (`server/schema.sql`) incluye las 11 entidades del modelo
  entidad-relación del trabajo de grado para ser fiel al diseño, pero solo
  `usuario`, `sala`, `reserva` y `administrativo` tienen lógica de negocio
  detrás en esta versión; `horario`, `asignatura`, `comunidad`, `mensaje` y
  `curso_bienestar` son estructura de base de datos sin pantallas que
  escriban en ellas todavía.
