import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import ScheduleGrid from '../components/ScheduleGrid.jsx';

export default function MySchedule() {
  const navigate = useNavigate();

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-gesty-text">
          Mi Horario de Clases
          <button onClick={() => navigate('/app/horario/personalizar')} className="text-gesty-orange">
            <Pencil size={15} />
          </button>
        </h1>
        <p className="mt-1 text-sm text-slate-400">Consulta tu horario semanal de clases</p>
      </div>
      <ScheduleGrid />
    </AppShell>
  );
}
