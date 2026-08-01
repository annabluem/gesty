import { useState } from 'react';
import { Search, MoreVertical, Paperclip, Send, UserPlus, ChevronDown } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { chatJuanImg, chatAnaImg } from '../assets/images';

const CONVERSATIONS = [
  {
    id: 1,
    name: 'Luisa Rodríguez',
    preview: 'Buen día.',
    time: '12:45 PM',
    unread: 2,
    color: 'bg-purple-200 text-purple-700',
  },
  {
    id: 2,
    name: 'Juan Lopéz',
    preview: 'Dale, muchas gracias.',
    time: '11:00 AM',
    color: 'bg-slate-200 text-slate-600',
    image: chatJuanImg,
  },
  {
    id: 3,
    name: 'Ana Jiménez',
    preview: 'Ok, nos vemos mañana.',
    time: '09:00 AM',
    color: 'bg-rose-200 text-rose-700',
    image: chatAnaImg,
  },
  {
    id: 4,
    name: 'Emanuel García',
    preview: 'A qué hora es tu clase??',
    time: 'Ayer',
    color: 'bg-orange-200 text-orange-700',
  },
];

const THREAD = [
  { from: 'them', text: 'Buen dia Maria, ¿Cómo has estado?' },
  { from: 'them', text: '¿Estás en clase???' },
  { from: 'them', text: 'Acabo de enviarte mi parte del trabajo' },
  { from: 'me', text: 'Buen dia Juan, todo bien y tu?' },
  { from: 'me', text: 'Si, estoy en clase y ya recibí tu parte' },
  { from: 'them', text: 'Perfecto! Me avisas si hace falta algo más' },
  { from: 'them', text: 'Que te vaya bien en clases' },
  { from: 'me', text: 'Dale, muchas gracias.' },
];

const CONTACTS = [
  { name: 'Pedro Díaz', color: 'bg-blue-500' },
  { name: 'Mateo Pérez', color: 'bg-amber-500' },
  { name: 'Ana Jiménez', color: 'bg-rose-400', image: chatAnaImg },
];

function Avatar({ name, image, color, className }) {
  if (image) {
    return <img src={image} alt={name} className={`${className} object-cover`} />;
  }
  return (
    <span className={`${className} flex items-center justify-center text-xs font-bold ${color}`}>
      {name[0]}
    </span>
  );
}

export default function Chat() {
  const [active, setActive] = useState(2);
  const activeConversation = CONVERSATIONS.find((c) => c.id === active);

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="flex h-full gap-6">
        <div className="w-64 shrink-0">
          <h2 className="flex items-center gap-1 font-display text-xl font-bold text-gesty-text">
            Mensajes <ChevronDown size={16} className="text-slate-400" />
          </h2>
          <label className="relative mt-4 block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Buscar mensajes"
              className="input-field bg-slate-50 pl-9"
            />
          </label>

          <ul className="mt-4 flex flex-col">
            {CONVERSATIONS.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left ${
                    active === c.id ? 'bg-gesty-orange-light' : 'hover:bg-slate-50'
                  }`}
                >
                  <Avatar {...c} className="h-9 w-9 shrink-0 rounded-full" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="truncate text-sm font-semibold text-gesty-text">{c.name}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">{c.time}</span>
                    </span>
                    <span className="block truncate text-xs text-slate-400">{c.preview}</span>
                  </span>
                  {c.unread && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gesty-orange text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
                <div className="mx-2 h-px bg-gesty-border" />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col rounded-xl border border-gesty-border">
          <div className="flex items-center justify-between border-b border-gesty-border p-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={activeConversation?.name ?? ''}
                image={activeConversation?.image}
                color="bg-slate-200 text-slate-600"
                className="h-9 w-9 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-gesty-text">{activeConversation?.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En línea
                </p>
              </div>
            </div>
            <MoreVertical size={16} className="text-slate-400" />
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-orange-50/40 p-4">
            {THREAD.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs ${
                    m.from === 'me'
                      ? 'bg-gesty-orange-light text-gesty-text'
                      : 'bg-white text-gesty-text shadow-sm'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gesty-border p-3">
            <Paperclip size={16} className="text-slate-400" />
            <input placeholder="Escribe un mensaje..." className="flex-1 bg-transparent text-sm outline-none" />
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gesty-orange text-white">
              <Send size={14} />
            </button>
          </div>
        </div>

        <div className="w-52 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-gesty-text">Contactos</h2>
            <UserPlus size={16} className="text-slate-400" />
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {CONTACTS.map((c) => (
              <li key={c.name} className="flex items-center gap-3 text-sm">
                <Avatar {...c} className="h-8 w-8 rounded-full text-white" />
                {c.name}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 flex items-center gap-2 font-display text-lg font-bold text-gesty-text">
            Comunidades
          </h2>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
              I
            </span>
            Ing. Software Team
          </div>
        </div>
      </div>
    </AppShell>
  );
}
