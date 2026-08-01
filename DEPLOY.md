# Cómo desplegar Gesty gratis (Render)

El proyecto ya está preparado para desplegarse como **un solo servicio**: en
producción, el backend Express sirve tanto la API (`/api/*`) como el
frontend compilado (`client/dist`), así que solo necesitas **un** servicio
web, sin configurar CORS ni dos dominios distintos.

Se usa [Render](https://render.com) porque tiene un plan gratuito real (sin
tarjeta de crédito) que soporta Node.js sin límite de tiempo — a diferencia
de Railway (ahora solo ofrece un trial) o Heroku (ya no tiene plan gratis).

## 0. Requisitos

- Cuenta de [GitHub](https://github.com) (gratis).
- Cuenta de [Render](https://render.com) (gratis, se puede crear con tu
  cuenta de GitHub directamente).

## 1. Subir el proyecto a GitHub

Desde la raíz del proyecto (`gesty/`):

```bash
git init
git add .
git commit -m "Prototipo Gesty"
```

Luego, en [github.com/new](https://github.com/new) crea un repositorio
vacío (sin README, sin .gitignore — ya los tienes) y conéctalo:

```bash
git remote add origin https://github.com/<tu-usuario>/gesty.git
git branch -M main
git push -u origin main
```

## 2. Crear el Web Service en Render

1. Entra a [dashboard.render.com](https://dashboard.render.com) → **New +**
   → **Web Service**.
2. Conecta tu cuenta de GitHub y selecciona el repositorio `gesty`.
3. Configura:

   | Campo | Valor |
   |---|---|
   | **Name** | `gesty` (o el que prefieras — define la URL: `gesty.onrender.com`) |
   | **Root Directory** | *(déjalo vacío — es la raíz del repo)* |
   | **Runtime** | Node |
   | **Build Command** | `npm run build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | **Free** |

4. Render detecta la versión de Node desde el archivo `.node-version` del
   repo (ya incluido, pide Node 22). No necesitas configurar nada más ahí.
5. Click **Create Web Service**. El primer build tarda 2–4 minutos —
   instala dependencias de `client/` y `server/`, compila el frontend, y
   arranca `server/index.js`.
6. Cuando termine, tu app queda disponible en
   `https://gesty-XXXX.onrender.com` (Render te da el link exacto).

Listo — esa misma URL sirve la app completa (pantallas + reserva de salas
funcional).

## ⚠️ Importante: el disco del plan gratuito es efímero

`server/gesty.db` es un archivo en disco. En el plan **Free** de Render, ese
disco **se reinicia** (vuelve a los datos sembrados de fábrica) cuando:

- Haces un nuevo deploy (`git push` de un cambio), o
- El servicio se "duerme" por 15 minutos sin tráfico y luego alguien vuelve
  a entrar (Render lo despierta automáticamente, tarda ~30-50s en responder
  esa primera petición).

Para una prueba de usabilidad de una sola sesión esto normalmente no importa
(las reservas creadas *durante* la sesión sí persisten mientras el servicio
esté despierto). Si necesitas que los datos sobrevivan entre sesiones o
redeploys, hay dos caminos, en orden de esfuerzo:

1. **Disco persistente pago de Render** (~US$1/mes por 1 GB) — el mismo
   código funciona igual, solo agregas un *Persistent Disk* en la
   configuración del servicio apuntando a `server/`.
2. **Cambiar SQLite local por una base de datos gratuita en la nube** (ej.
   [Turso](https://turso.tech), compatible con SQLite) — requiere modificar
   `server/db.js` para usar el cliente de Turso en vez de `node:sqlite`. Es
   un cambio de código real, no lo hicimos porque no era necesario para el
   alcance actual del prototipo.

## Actualizar el sitio después de cambios

Cada vez que quieras publicar cambios nuevos:

```bash
git add .
git commit -m "Describe el cambio"
git push
```

Render vuelve a desplegar automáticamente en cuanto detecta el push.
