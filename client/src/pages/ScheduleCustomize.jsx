import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Info } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { SEMESTER_SUBJECTS } from '../data/schedule.js';
import { horarioPersonalizadoImg } from '../assets/images';

export default function ScheduleCustomize() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState(SEMESTER_SUBJECTS);

  function toggle(name) {
    setSubjects((prev) =>
      prev.map((s) => (s.name === name ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="flex h-full items-center gap-10">
        <div className="w-full max-w-sm">
          <h1 className="flex items-center gap-2 font-display text-xl font-bold text-gesty-text">
            Personaliza tu Horario <Pencil size={15} className="text-gesty-orange" />
          </h1>
          <p className="mt-1 text-sm text-slate-400">Elige un semestre y selecciona tus materias</p>

          <label className="mt-6 block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Semestre</span>
            <select className="input-field bg-slate-50" defaultValue="Semestre 8">
              {['Semestre 6', 'Semestre 7', 'Semestre 8', 'Semestre 9'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <ul className="mt-4 flex flex-col divide-y divide-gesty-border">
            {subjects.map((s) => (
              <li key={s.name} className="flex items-center justify-between py-3 text-sm">
                <span className="text-gesty-text">{s.name}</span>
                <button
                  onClick={() => toggle(s.name)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    s.enabled ? 'bg-gesty-orange' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      s.enabled ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <Info size={15} className="mt-0.5 shrink-0 text-slate-400" />
            Tu horario de clases se generara a partir de las materias que pre-seleccionaste,
            ¿Deseas continuar?
          </div>

          <button
            onClick={() => navigate('/app/horario/mio')}
            className="mt-5 w-full rounded-xl bg-gesty-orange py-2.5 text-sm font-semibold text-white hover:bg-gesty-orange-dark"
          >
            Continuar
          </button>
        </div>

        <div className="hidden h-full flex-1 overflow-hidden rounded-2xl sm:block">
          <img src={horarioPersonalizadoImg} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </AppShell>
  );
}
