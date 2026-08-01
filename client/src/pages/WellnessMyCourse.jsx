import { useLocation, Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';

function addHours(time, hours) {
  const [h, m] = time.split(':').map(Number);
  const total = (h + hours) % 24;
  return `${String(total).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function WellnessMyCourse() {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/app/bienestar" replace />;
  }

  const { courseName, teacher, image, selected } = state;

  return (
    <AppShell sidebarVariant="collapsed">
      <h1 className="font-display text-xl font-bold text-gesty-text">Tu Curso</h1>

      <div className="mt-6 max-w-sm overflow-hidden rounded-2xl border border-gesty-border">
        <img src={image} alt="" className="h-32 w-full object-cover" />
        <div className="bg-slate-50 p-5">
          <h2 className="font-display text-lg font-bold text-gesty-text">{courseName}</h2>
          <p className="text-xs text-slate-400">Docente: {teacher}</p>
          <div className="my-4 h-px bg-gesty-border" />
          <p className="text-sm font-medium text-gesty-text">Horario:</p>
          <p className="mt-1 text-sm text-slate-500">
            {selected.day} {selected.time} a {addHours(selected.time, 2)}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
