import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, getPerfilesDemo } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Solo existe despues de `npm run build` (ver package.json de la raiz).
// En desarrollo el cliente lo sirve Vite por separado, asi que esta carpeta
// no existe y este middleware no interfiere con `npm run dev`.
const clientDist = path.join(__dirname, '../client/dist');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(clientDist));

const ROLES_QUE_RESERVAN = new Set(['Docente', 'Administrativo']);
const ESTADOS_ADMIN = new Set(['Aprobada', 'Rechazada']);
const ESTADOS_ACTIVOS = ['Pendiente', 'Aprobada'];

const HORA_APERTURA = '07:00';
const HORA_CIERRE = '19:00';

function fechaDeHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function haySolapamiento(id_sala, fecha, hora_inicio, hora_fin) {
  const placeholders = ESTADOS_ACTIVOS.map(() => '?').join(', ');
  const fila = db
    .prepare(`
      SELECT 1 FROM reserva
      WHERE id_sala = ?
        AND fecha = ?
        AND estado IN (${placeholders})
        AND hora_inicio < ?
        AND hora_fin > ?
      LIMIT 1
    `)
    .get(id_sala, fecha, ...ESTADOS_ACTIVOS, hora_fin, hora_inicio);
  return Boolean(fila);
}

function getUsuario(id) {
  return db.prepare('SELECT * FROM usuario WHERE id_usuario = ?').get(id);
}

function getSala(id) {
  return db.prepare('SELECT * FROM sala WHERE id_sala = ?').get(id);
}

function getAdministrativoIdPorUsuario(idUsuario) {
  const row = db
    .prepare('SELECT id_administrativo FROM administrativo WHERE id_usuario = ?')
    .get(idUsuario);
  return row?.id_administrativo ?? null;
}

// GET /api/perfiles-demo -> perfiles Docente/Administrativo que simula el selector del cliente
app.get('/api/perfiles-demo', (req, res) => {
  res.json(getPerfilesDemo());
});

// GET /api/salas -> catalogo de salas reservables (regla de negocio: solo estado 'Disponible')
app.get('/api/salas', (req, res) => {
  const rows = db
    .prepare("SELECT * FROM sala WHERE estado = 'Disponible' ORDER BY bloque, nombre")
    .all();
  res.json(rows);
});

const RESERVA_SELECT = `
  SELECT
    r.id_reserva, r.fecha, r.hora_inicio, r.hora_fin, r.motivo, r.estado, r.fecha_solicitud,
    r.id_usuario, r.id_sala, r.id_administrativo,
    u.nombre || ' ' || u.apellido AS usuario_nombre,
    u.rol AS usuario_rol,
    s.nombre AS sala_nombre, s.bloque AS sala_bloque,
    a_u.nombre AS administrativo_nombre
  FROM reserva r
  JOIN usuario u ON u.id_usuario = r.id_usuario
  JOIN sala s ON s.id_sala = r.id_sala
  LEFT JOIN administrativo a ON a.id_administrativo = r.id_administrativo
  LEFT JOIN usuario a_u ON a_u.id_usuario = a.id_usuario
`;

// GET /api/reservas -> lista de solicitudes.
// rol=Administrativo ve todas; con id_usuario un Docente ve solo las suyas.
app.get('/api/reservas', (req, res) => {
  const { rol, id_usuario } = req.query;

  let rows;
  if (rol === 'Administrativo') {
    rows = db.prepare(`${RESERVA_SELECT} ORDER BY r.id_reserva DESC`).all();
  } else if (id_usuario) {
    rows = db
      .prepare(`${RESERVA_SELECT} WHERE r.id_usuario = ? ORDER BY r.id_reserva DESC`)
      .all(id_usuario);
  } else {
    rows = db.prepare(`${RESERVA_SELECT} ORDER BY r.id_reserva DESC`).all();
  }

  res.json(rows);
});

// POST /api/reservas -> crea una solicitud con estado 'Pendiente'.
// Regla de negocio: solo usuarios con rol Docente o Administrativo pueden reservar
// (se valida contra el rol real almacenado en USUARIO, no contra lo que envie el cliente).
app.post('/api/reservas', (req, res) => {
  const { id_usuario, id_sala, motivo, fecha, hora_inicio, hora_fin } = req.body;

  // Ningun campo obligatorio puede llegar vacio (ni solo espacios en blanco).
  const faltantes = [
    !id_usuario && 'id_usuario',
    !id_sala && 'id_sala',
    !motivo?.trim() && 'motivo',
    !fecha?.trim() && 'fecha',
    !hora_inicio?.trim() && 'hora_inicio',
    !hora_fin?.trim() && 'hora_fin',
  ].filter(Boolean);
  if (faltantes.length > 0) {
    return res.status(400).json({ error: `Faltan campos obligatorios: ${faltantes.join(', ')}.` });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora_inicio) || !/^\d{2}:\d{2}$/.test(hora_fin)) {
    return res.status(400).json({ error: 'Formato de fecha u hora invalido.' });
  }

  const usuario = getUsuario(id_usuario);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }
  if (!ROLES_QUE_RESERVAN.has(usuario.rol)) {
    return res.status(403).json({
      error: 'Solo Docentes o Administrativos pueden reservar espacios.',
    });
  }

  const sala = getSala(id_sala);
  if (!sala) {
    return res.status(404).json({ error: 'Sala no encontrada.' });
  }

  // La fecha de la reserva no puede ser anterior a hoy.
  if (fecha < fechaDeHoy()) {
    return res.status(400).json({ error: 'La fecha de la reserva no puede ser anterior a hoy.' });
  }

  // La hora de fin debe ser posterior a la hora de inicio.
  if (hora_fin <= hora_inicio) {
    return res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio.' });
  }

  // Las reservas solo se permiten dentro del horario de atencion del campus.
  if (hora_inicio < HORA_APERTURA || hora_fin > HORA_CIERRE) {
    return res.status(400).json({
      error: `Las reservas solo se pueden hacer entre las ${HORA_APERTURA} y las ${HORA_CIERRE}.`,
    });
  }

  // No se puede reservar la misma sala dos veces en un horario que se solape.
  if (haySolapamiento(id_sala, fecha, hora_inicio, hora_fin)) {
    return res.status(409).json({ error: 'Esa sala ya tiene una reserva en ese horario.' });
  }

  const info = db
    .prepare(`
      INSERT INTO reserva (fecha, hora_inicio, hora_fin, motivo, estado, id_usuario, id_sala)
      VALUES (?, ?, ?, ?, 'Pendiente', ?, ?)
    `)
    .run(fecha, hora_inicio, hora_fin, motivo.trim(), id_usuario, id_sala);

  const nueva = db
    .prepare(`${RESERVA_SELECT} WHERE r.id_reserva = ?`)
    .get(info.lastInsertRowid);
  res.status(201).json(nueva);
});

// PATCH /api/reservas/:id -> un Administrativo aprueba/rechaza, o el Docente dueno cancela.
app.patch('/api/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { estado, id_usuario } = req.body;

  const reserva = db.prepare('SELECT * FROM reserva WHERE id_reserva = ?').get(id);
  if (!reserva) {
    return res.status(404).json({ error: 'Solicitud no encontrada.' });
  }

  if (ESTADOS_ADMIN.has(estado)) {
    const usuario = getUsuario(id_usuario);
    const idAdministrativo = usuario && getAdministrativoIdPorUsuario(usuario.id_usuario);
    if (!idAdministrativo) {
      return res.status(403).json({ error: 'Solo un Administrativo puede aprobar o rechazar reservas.' });
    }
    db.prepare('UPDATE reserva SET estado = ?, id_administrativo = ? WHERE id_reserva = ?').run(
      estado, idAdministrativo, id,
    );
  } else if (estado === 'Cancelada') {
    if (Number(reserva.id_usuario) !== Number(id_usuario)) {
      return res.status(403).json({ error: 'Solo el usuario que solicito la reserva puede cancelarla.' });
    }
    db.prepare("UPDATE reserva SET estado = 'Cancelada' WHERE id_reserva = ?").run(id);
  } else {
    return res.status(400).json({ error: 'Estado invalido.' });
  }

  const actualizada = db.prepare(`${RESERVA_SELECT} WHERE r.id_reserva = ?`).get(id);
  res.json(actualizada);
});

// Cualquier ruta GET que no sea /api/* y no coincida con un archivo estatico
// devuelve index.html, para que las rutas de react-router (ej. /app/reservas)
// funcionen al recargar la pagina o entrar directo por URL.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  const indexPath = path.join(clientDist, 'index.html');
  if (!existsSync(indexPath)) return next();
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Gesty API escuchando en http://localhost:${PORT}`);
});
