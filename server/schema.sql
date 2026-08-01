-- Esquema de la base de datos de Gesty.
-- Refleja el modelo entidad-relacion completo definido para el trabajo de
-- grado (11 entidades). De este modelo, el prototipo ejecuta logica real
-- solo sobre USUARIO, SALA, RESERVA y ADMINISTRATIVO (el flujo de Reserva
-- de Salas); el resto de tablas existen para que el esquema sea fiel al
-- diseno, aunque sus pantallas en el cliente todavia son estaticas.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- USUARIO: toda persona de la comunidad bonaventuriana (base de Docente,
-- Administrativo y Estudiante mediante el campo rol).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
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

-- ---------------------------------------------------------------------
-- ADMINISTRATIVO: especializacion de USUARIO (rol = 'Administrativo').
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administrativo (
  id_administrativo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario (id_usuario)
);

-- ---------------------------------------------------------------------
-- SALA: espacios reservables del campus.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sala (
  id_sala INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  bloque TEXT NOT NULL,
  capacidad INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'No disponible'))
);

-- ---------------------------------------------------------------------
-- RESERVA: unica entidad con logica de negocio completa en este prototipo.
-- id_administrativo queda NULL hasta que un Administrativo aprueba/rechaza.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reserva (
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

-- ---------------------------------------------------------------------
-- HORARIO / DETALLE_HORARIO / ASIGNATURA: modulo de horario de clases.
-- Modelados para fidelidad con el diseno; el cliente los muestra con
-- datos estaticos (no hay pantalla que escriba en estas tablas aun).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS horario (
  id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
  semestre TEXT NOT NULL,
  personalizado TEXT NOT NULL DEFAULT 'No' CHECK (personalizado IN ('Si', 'No')),
  id_usuario INTEGER NOT NULL REFERENCES usuario (id_usuario)
);

CREATE TABLE IF NOT EXISTS asignatura (
  id_asignatura INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  semestre TEXT NOT NULL,
  salon TEXT,
  fecha TEXT,
  hora TEXT,
  id_docente INTEGER NOT NULL REFERENCES usuario (id_usuario)
);

CREATE TABLE IF NOT EXISTS detalle_horario (
  id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
  id_horario INTEGER NOT NULL REFERENCES horario (id_horario),
  id_asignatura INTEGER NOT NULL REFERENCES asignatura (id_asignatura)
);

-- ---------------------------------------------------------------------
-- COMUNIDAD / MIEMBRO_COMUNIDAD / MENSAJE: modulo de chat institucional.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comunidad (
  id_comunidad INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  codigo_ingreso TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS miembro_comunidad (
  id_miembro INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER NOT NULL REFERENCES usuario (id_usuario),
  id_comunidad INTEGER NOT NULL REFERENCES comunidad (id_comunidad),
  fecha_ingreso TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mensaje (
  id_mensaje INTEGER PRIMARY KEY AUTOINCREMENT,
  texto TEXT,
  imagen TEXT,
  video TEXT,
  fecha_hora TEXT NOT NULL DEFAULT (datetime('now')),
  id_usuario INTEGER NOT NULL REFERENCES usuario (id_usuario),
  id_comunidad INTEGER REFERENCES comunidad (id_comunidad)
);

-- ---------------------------------------------------------------------
-- CURSO_BIENESTAR / INSCRIPCION_BIENESTAR: modulo de bienestar estudiantil.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curso_bienestar (
  id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  horario TEXT,
  fecha_inicio TEXT,
  fecha_fin TEXT,
  cupos INTEGER,
  disponibilidad TEXT NOT NULL DEFAULT 'Activo' CHECK (disponibilidad IN ('Activo', 'Inactivo')),
  id_docente INTEGER NOT NULL REFERENCES usuario (id_usuario)
);

CREATE TABLE IF NOT EXISTS inscripcion_bienestar (
  id_inscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER NOT NULL REFERENCES usuario (id_usuario),
  id_curso INTEGER NOT NULL REFERENCES curso_bienestar (id_curso),
  fecha_inscripcion TEXT NOT NULL DEFAULT (datetime('now')),
  estado TEXT NOT NULL DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Cancelada'))
);
