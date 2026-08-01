import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { COURSE_SCHEDULES, getCourse, getCourseImage } from '../data/wellness.js';

const DEFAULT_SCHEDULE = [
  { day: 'Martes', times: ['15:00', '17:00'] },
  { day: 'Viernes', times: ['15:00', '17:00'] },
];

export default function WellnessSelect() {
  const navigate = useNavigate();
  const { categoria, curso } = useParams();
  const course = getCourse(categoria, curso);
  const schedule = COURSE_SCHEDULES[curso] ?? DEFAULT_SCHEDULE;
  const image = getCourseImage(categoria, course);

  const [selected, setSelected] = useState({ day: schedule[0].day, time: schedule[0].times[0] });

  function confirm() {
    navigate('/app/bienestar/mi-curso', {
      state: { categoria, curso, courseName: course?.name, teacher: course?.teacher, image, selected },
    });
  }

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-gesty-border">
        <button
          onClick={() => navigate(`/app/bienestar/${categoria}`)}
          className="relative flex h-32 w-full items-start p-3 text-white"
        >
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-black/25" />
          <ArrowLeft size={18} className="relative" />
        </button>
        <div className="bg-slate-50 p-5">
          <h1 className="font-display text-lg font-bold text-gesty-text">{course?.name}</h1>
          <p className="text-xs text-slate-400">Docente: {course?.teacher}</p>
          <div className="my-4 h-px bg-gesty-border" />

          <p className="mb-2 text-sm font-medium text-gesty-text">Selecciona un horario:</p>
          {schedule.map((s) => (
            <div key={s.day} className="mb-3">
              <p className="mb-1.5 text-xs font-semibold text-slate-500">{s.day}</p>
              <div className="flex gap-2">
                {s.times.map((t) => {
                  const isSelected = selected.day === s.day && selected.time === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelected({ day: s.day, time: t })}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                        isSelected
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-end">
            <button
              onClick={confirm}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gesty-orange text-white hover:bg-gesty-orange-dark"
            >
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
