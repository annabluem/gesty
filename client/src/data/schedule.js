export const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

export const DAY_START = 7;
export const DAY_END = 16;

export const TIME_LABELS = ['7:00 - 9:00', '9:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00'];

export const CLASSES = [
  { day: 'Lunes', start: 7, end: 9, subject: 'Ingeniería de Software', teacher: 'Katia Paternina', room: 'Sala 1' },
  { day: 'Lunes', start: 11, end: 13, subject: 'Física Eléctrica', teacher: 'Cristian Pérez', room: 'Sala 4' },

  { day: 'Martes', start: 9, end: 11, subject: 'Lógica Digital', teacher: 'Cristian Pérez', room: 'Sala 2' },
  { day: 'Martes', start: 11, end: 13, subject: 'Base de Datos', teacher: 'Katia Paternina', room: 'Sala 1' },

  { day: 'Miercoles', start: 7, end: 9, subject: 'Ingeniería de Software', teacher: 'Katia Paternina', room: 'Sala 1' },
  { day: 'Miercoles', start: 9, end: 11, subject: 'Métodos Numéricos', teacher: 'Julio Cisneros', room: 'Sala 7' },

  { day: 'Jueves', start: 7, end: 9, subject: 'Diseño Digital', teacher: 'Luis Carlos Jiménez', room: 'Sala Chroma' },
  { day: 'Jueves', start: 9, end: 11, subject: 'Principios de Electrónica', teacher: 'Cristian Pérez', room: 'Sala 1' },
  { day: 'Jueves', start: 11, end: 13, subject: 'Ingeniería de Software', teacher: 'Katia Paternina', room: 'Sala 1' },

  { day: 'Viernes', start: 9, end: 11, subject: 'Métodos Numéricos', teacher: 'Julio Cisneros', room: 'Sala 7' },
  { day: 'Viernes', start: 14, end: 16, subject: 'Diseño Digital', teacher: 'Luis Carlos Jiménez', room: 'Sala Chroma' },
];

export const SEMESTER_SUBJECTS = [
  { name: 'Proyecto integrador web', enabled: true },
  { name: 'Base de datos', enabled: true },
  { name: 'Métodos numéricos', enabled: true },
  { name: 'Lógica digital', enabled: false },
  { name: 'Profesional complementaria II', enabled: false },
  { name: 'Constitución y democracia', enabled: true },
];
