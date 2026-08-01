import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { CATEGORIES } from '../data/wellness.js';

export default function WellnessCategories() {
  const navigate = useNavigate();

  return (
    <AppShell sidebarVariant="collapsed">
      <h1 className="font-display text-xl font-bold text-gesty-text">
        Únete a un Curso de Bienestar Estudiantil
      </h1>
      <p className="mt-1 text-sm text-slate-400">Selecciona una de las categorías a continuación:</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => navigate(`/app/bienestar/${cat.slug}`)}
            className="relative flex h-32 items-end overflow-hidden rounded-xl text-left text-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <img
              src={cat.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="relative p-3 font-display text-lg font-bold drop-shadow">{cat.name}</span>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
