import { Clock } from 'lucide-react';
import { DAYS, DAY_START, DAY_END, TIME_LABELS, CLASSES } from '../data/schedule.js';

const GRID_HEIGHT = 480;
const TOTAL_HOURS = DAY_END - DAY_START;

function toTop(hour) {
  return ((hour - DAY_START) / TOTAL_HOURS) * 100;
}

export default function ScheduleGrid() {
  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-50">
      <div className="flex min-w-[780px]">
        <div className="flex w-28 shrink-0 flex-col items-center gap-2 p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gesty-orange text-white">
            <Clock size={16} />
          </div>
          <div className="relative w-full" style={{ height: GRID_HEIGHT }}>
            <div
              className="absolute left-2 w-2.5 rounded-full bg-gesty-orange"
              style={{ height: GRID_HEIGHT }}
            />
            {TIME_LABELS.map((label) => {
              const [startStr] = label.split(' - ');
              const startHour = parseInt(startStr, 10);
              return (
                <span
                  key={label}
                  className="absolute left-6 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium text-slate-500"
                  style={{ top: `${toTop(startHour)}%` }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-5 gap-2 p-2">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col">
              <div className="mb-2 rounded-lg bg-gesty-navy py-2 text-center text-xs font-semibold text-white">
                {day}
              </div>
              <div className="relative" style={{ height: GRID_HEIGHT }}>
                {CLASSES.filter((c) => c.day === day).map((c, i) => {
                  const top = toTop(c.start);
                  const height = ((c.end - c.start) / TOTAL_HOURS) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute inset-x-0 rounded-lg border border-gesty-border bg-white p-2 shadow-sm"
                      style={{ top: `${top}%`, height: `${height}%` }}
                    >
                      <p className="text-[11px] font-bold leading-tight text-gesty-text">{c.subject}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{c.teacher}</p>
                      <p className="text-[10px] text-slate-400">{c.room}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
