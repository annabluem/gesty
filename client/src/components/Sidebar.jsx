import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Clock,
  MonitorPlay,
  Dumbbell,
  Settings,
  LogOut,
} from 'lucide-react';
import Logo from './Logo.jsx';
import { usuarioPerfilImg } from '../assets/images';

const NAV_ITEMS = [
  { to: '/app/inicio', label: 'Inicio', icon: Home },
  { to: '/app/chats', label: 'Chats', icon: MessageCircle },
  { to: '/app/horario', label: 'Mi Horario', icon: Clock },
  { to: '/app/reservas', label: 'Reserva de Salas', icon: MonitorPlay },
  { to: '/app/bienestar', label: 'Cursos de Bienestar', icon: Dumbbell },
];

function itemClasses(isActive, expanded) {
  const base = expanded
    ? 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors'
    : 'flex items-center justify-center rounded-xl p-2.5 transition-colors';
  const active = isActive
    ? 'bg-gesty-orange-light text-gesty-orange'
    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600';
  return `${base} ${active}`;
}

export default function Sidebar({ variant = 'expanded' }) {
  const expanded = variant === 'expanded';

  return (
    <aside
      className={`flex h-full flex-col border-r border-gesty-border ${
        expanded ? 'w-56 px-4 py-6' : 'w-20 items-center py-6'
      }`}
    >
      <div className={expanded ? 'mb-8 px-2' : 'mb-8'}>
        {expanded ? (
          <Logo />
        ) : (
          <img
            src={usuarioPerfilImg}
            alt="María Pérez"
            className="h-9 w-9 rounded-full object-cover"
          />
        )}
      </div>

      <nav className={expanded ? 'flex flex-1 flex-col gap-1' : 'flex flex-1 flex-col gap-3'}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => itemClasses(isActive, expanded)}
            title={label}
          >
            <Icon size={19} strokeWidth={2} />
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={expanded ? 'flex flex-col gap-1' : 'flex flex-col items-center gap-3'}>
        <NavLink to="/app/ajustes" className={({ isActive }) => itemClasses(isActive, expanded)} title="Configuración">
          <Settings size={19} />
          {expanded && <span>Configuración</span>}
        </NavLink>
        <NavLink to="/" className={({ isActive }) => itemClasses(false, expanded)} title="Cerrar Sesión">
          <LogOut size={19} />
          {expanded && <span>Cerrar Sesión</span>}
        </NavLink>
      </div>
    </aside>
  );
}
