import {
  categoriaDeporteImg,
  categoriaMusicaImg,
  categoriaArteImg,
  categoriaOratoriaImg,
  categoriaLecturaImg,
  categoriaHabilidadesBlandasImg,
  cursoTaekwondoImg,
  cursoBaloncestoImg,
  cursoVoleibolImg,
  cursoAcondicionamientoFisicoImg,
  cursoLecturaImg,
} from '../assets/images';

export const CATEGORIES = [
  { slug: 'deporte', name: 'Deporte', image: categoriaDeporteImg },
  { slug: 'musica', name: 'Música', image: categoriaMusicaImg },
  { slug: 'arte', name: 'Arte', image: categoriaArteImg },
  { slug: 'oratoria', name: 'Oratoria', image: categoriaOratoriaImg },
  { slug: 'lectura', name: 'Lectura', image: categoriaLecturaImg },
  { slug: 'habilidades-blandas', name: 'Habilidades Blandas', image: categoriaHabilidadesBlandasImg },
];

export const COURSES = {
  deporte: [
    { slug: 'futbol', name: 'Fútbol', teacher: 'Mario Calderón', image: categoriaDeporteImg },
    { slug: 'taekwondo', name: 'Taekwondo', teacher: 'Mario Calderón', image: cursoTaekwondoImg },
    { slug: 'baloncesto', name: 'Baloncesto', teacher: 'Mario Calderón', image: cursoBaloncestoImg },
    { slug: 'voleibol', name: 'Voleibol', teacher: 'Mario Calderón', image: cursoVoleibolImg },
    {
      slug: 'acondicionamiento-fisico',
      name: 'Acondicionamiento Físico',
      teacher: 'Mario Calderón',
      image: cursoAcondicionamientoFisicoImg,
    },
  ],
  musica: [
    { slug: 'guitarra', name: 'Guitarra', teacher: 'Julio Cisneros' },
    { slug: 'piano', name: 'Piano', teacher: 'Julio Cisneros' },
    { slug: 'canto', name: 'Canto', teacher: 'Katia Paternina' },
  ],
  arte: [
    { slug: 'pintura', name: 'Pintura', teacher: 'Luis Carlos Jiménez' },
    { slug: 'dibujo', name: 'Dibujo', teacher: 'Luis Carlos Jiménez' },
  ],
  oratoria: [{ slug: 'oratoria-i', name: 'Oratoria I', teacher: 'Cristian Pérez' }],
  lectura: [{ slug: 'club-de-lectura', name: 'Club de Lectura', teacher: 'Katia Paternina', image: cursoLecturaImg }],
  'habilidades-blandas': [
    { slug: 'liderazgo', name: 'Liderazgo', teacher: 'Cristian Pérez' },
    { slug: 'trabajo-en-equipo', name: 'Trabajo en Equipo', teacher: 'Katia Paternina' },
  ],
};

export const COURSE_SCHEDULES = {
  futbol: [
    { day: 'Martes', times: ['15:00', '17:00'] },
    { day: 'Viernes', times: ['15:00', '17:00'] },
  ],
};

export function getCourse(categorySlug, courseSlug) {
  const list = COURSES[categorySlug] ?? [];
  return list.find((c) => c.slug === courseSlug);
}

// Un curso sin foto propia hereda la foto de su categoría.
export function getCourseImage(categorySlug, course) {
  if (course?.image) return course.image;
  return CATEGORIES.find((c) => c.slug === categorySlug)?.image;
}
