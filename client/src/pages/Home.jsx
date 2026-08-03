import { ChevronDown, User } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { bannerPosgradosImg, bannerUsbNewsImg, bannerEleccionesImg, usuarioPerfilImg } from '../assets/images';

const NEWS = [
  {
    title: 'Inscripciones Abiertas',
    image: bannerPosgradosImg,
    className: 'col-span-2 row-span-2',
  },
  {
    title: 'USB News',
    image: bannerUsbNewsImg,
    className: '',
  },
  {
    title: 'Elecciones Bonaventurianas 2026',
    subtitle: 'Postúlate · Participa · Vota',
    image: bannerEleccionesImg,
    overlay: true,
    className: 'row-span-2',
  },
  {
    title: 'Semana del Idioma Español 2026',
    subtitle: 'Cronograma de actividades para la Semana del idioma USB.',
    className: 'bg-amber-400 text-slate-900',
  },
  {
    title: 'Inscripciones Abiertas 2026-2',
    className: 'bg-gradient-to-br from-fuchsia-600 to-purple-600',
  },
];

const NOTIFICATIONS = [
  { name: 'Juana', text: 'te mandó un mensaje', time: 'Ahora' },
  { name: 'Tu solicitud', text: 'ha sido aprobada', time: '' },
  { name: 'Julia', text: 'te mandó un mensaje', time: '3h' },
];

export default function Home() {
  return (
    <AppShell sidebarVariant="expanded">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gesty-text">
            ¡Bienvenido(a), María!
          </h1>
          <p className="mt-1 text-sm text-slate-400">Es un gusto tenerte de vuelta.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-gesty-border px-3 py-1.5 text-sm">
          <img src={usuarioPerfilImg} alt="María Pérez" className="h-7 w-7 rounded-full object-cover" />
          <span className="text-left leading-tight">
            <span className="block font-medium text-gesty-text">María Pérez</span>
            <span className="block text-[11px] text-slate-400">Estudiante</span>
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="mt-4 h-px bg-gesty-border" />

      <div className="mt-6 grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h2 className="mb-3 font-display text-lg font-semibold text-gesty-text">
            Últimas Novedades
          </h2>
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {NEWS.map((item) =>
              item.image && item.overlay ? (
                <div
                  key={item.title}
                  className={`relative flex flex-col justify-end overflow-hidden rounded-xl p-4 text-white shadow-sm ${item.className}`}
                  style={{ minHeight: 110 }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="relative font-display text-sm font-bold leading-snug">{item.title}</p>
                  {item.subtitle && (
                    <p className="relative mt-1 text-xs leading-snug opacity-90">{item.subtitle}</p>
                  )}
                </div>
              ) : item.image ? (
                <div
                  key={item.title}
                  className={`overflow-hidden rounded-xl shadow-sm ${item.className}`}
                  style={{ minHeight: 110 }}
                >
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div
                  key={item.title}
                  className={`flex flex-col justify-end rounded-xl p-4 text-white shadow-sm ${item.className}`}
                  style={{ minHeight: 110 }}
                >
                  {item.tag && (
                    <span className="mb-1 text-[10px] font-medium uppercase tracking-wide opacity-80">
                      {item.tag}
                    </span>
                  )}
                  <p className="font-display text-sm font-bold leading-snug">{item.title}</p>
                  {item.subtitle && (
                    <p className="mt-1 text-xs leading-snug opacity-90">{item.subtitle}</p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-gesty-border p-4">
            <h3 className="mb-3 text-sm font-semibold text-gesty-text">Notificaciones</h3>
            <ul className="flex flex-col gap-3">
              {NOTIFICATIONS.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <User size={13} />
                  </span>
                  <span className="text-slate-500">
                    <span className="font-semibold text-gesty-text">{n.name}</span> {n.text}
                  </span>
                  {n.time && <span className="ml-auto shrink-0 text-slate-300">{n.time}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
