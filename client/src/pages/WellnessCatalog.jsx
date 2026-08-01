import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { CATEGORIES, COURSES, getCourseImage } from '../data/wellness.js';

export default function WellnessCatalog() {
  const navigate = useNavigate();
  const { categoria } = useParams();
  const category = CATEGORIES.find((c) => c.slug === categoria);
  const courses = COURSES[categoria] ?? [];

  return (
    <AppShell sidebarVariant="collapsed">
      <button
        onClick={() => navigate('/app/bienestar')}
        className="flex items-center gap-2 font-display text-xl font-bold text-gesty-text"
      >
        <ArrowLeft size={18} /> {category?.name ?? categoria}
      </button>
      <p className="mt-1 text-sm text-slate-400">Selecciona un curso:</p>

      <ul className="mt-6 flex max-w-md flex-col gap-3">
        {courses.map((course) => (
          <li key={course.slug}>
            <button
              onClick={() => navigate(`/app/bienestar/${categoria}/${course.slug}`)}
              className="flex w-full items-center gap-4 rounded-xl border border-gesty-border p-3 text-left hover:bg-slate-50"
            >
              <img
                src={getCourseImage(categoria, course)}
                alt=""
                className="h-12 w-16 shrink-0 rounded-lg object-cover"
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-gesty-text">{course.name}</span>
                <span className="block text-xs text-slate-400">Docente: {course.teacher}</span>
              </span>
              <ArrowRight size={16} className="text-slate-300" />
            </button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
