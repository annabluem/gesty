import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'gesty.db');
const schemaPath = path.join(__dirname, 'schema.sql');

export const db = new DatabaseSync(dbPath);
db.exec(readFileSync(schemaPath, 'utf8'));

// Datos de referencia minimos para que el flujo de Reserva de Salas tenga
// USUARIO / SALA / ADMINISTRATIVO reales sobre los que apoyar las llaves
// foraneas (no hay login real: estos son los perfiles que simula el
// selector "Docente / Administrativo" en el cliente).
function seed() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM usuario').get();
  if (count > 0) return;

  const insertUsuario = db.prepare(`
    INSERT INTO usuario (nombre, apellido, correo_institucional, contrasena, nombre_usuario, rol)
    VALUES (?, ?, ?, 'demo', ?, ?)
  `);

  const estudiante = insertUsuario.run(
    'María', 'Pérez', 'maria.perez@usbcartagena.edu.co', 'maria.perez', 'Estudiante',
  );
  const docente = insertUsuario.run(
    'Cristian', 'Pérez', 'cristian.perez@usbcartagena.edu.co', 'cristian.perez', 'Docente',
  );
  const administrativo = insertUsuario.run(
    'Laura', 'Gómez', 'laura.gomez@usbcartagena.edu.co', 'laura.gomez', 'Administrativo',
  );

  db.prepare('INSERT INTO administrativo (id_usuario) VALUES (?)').run(
    administrativo.lastInsertRowid,
  );

  const insertSala = db.prepare(`
    INSERT INTO sala (nombre, bloque, capacidad) VALUES (?, ?, ?)
  `);
  insertSala.run('Salón A21', 'Bloque A', 30);
  insertSala.run('Salón A22', 'Bloque A', 30);
  insertSala.run('Salón A23', 'Bloque A', 25);
  insertSala.run('Laboratorio de Química 1', 'Bloque B', 20);
  insertSala.run('Laboratorio de Química 2', 'Bloque B', 20);
  insertSala.run('Sala Chroma', 'Bloque C', 12);
  insertSala.run('Sala de Música', 'Bloque C', 10);

  return { estudiante, docente, administrativo };
}

seed();

// Perfiles simulados que expone la API para el selector Docente/Administrativo
// del cliente (no hay autenticacion real en este prototipo).
export function getPerfilesDemo() {
  const rows = db
    .prepare(
      `SELECT id_usuario, nombre, apellido, rol
       FROM usuario
       WHERE rol IN ('Docente', 'Administrativo')`,
    )
    .all();

  return Object.fromEntries(rows.map((r) => [r.rol, r]));
}
