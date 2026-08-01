import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';

const TABS = ['Perfil', 'Seguridad', 'Notificaciones', 'Interfaz'];

export default function Settings() {
  const [tab, setTab] = useState('Perfil');

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="mx-auto max-w-xl">
        <div className="flex gap-6 border-b border-gesty-border text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 font-medium ${
                tab === t
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Perfil' ? (
          <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
            <p className="mb-2 text-sm font-medium text-gesty-text">Tu Foto de Perfil</p>
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gesty-border text-slate-400">
              <ImagePlus size={18} />
              <span className="text-[10px]">Subir imagen</span>
              <input type="file" className="hidden" />
            </label>

            <div className="my-6 h-px bg-gesty-border" />

            <div className="grid grid-cols-2 gap-4">
              <label className="text-xs font-medium text-slate-500">
                Nombre Completo
                <input placeholder="Ingresa tu nombre completo" className="input-field mt-1 bg-slate-50" />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Email
                <input placeholder="Ingresa tu email" className="input-field mt-1 bg-slate-50" />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Nombre de Usuario
                <input placeholder="Ingresa tu nombre de usuario" className="input-field mt-1 bg-slate-50" />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Número Telefónico
                <div className="input-field mt-1 flex items-center gap-2 bg-slate-50">
                  <span className="text-slate-400">+57</span>
                  <input placeholder="Ingresa tu número telefónico" className="w-full bg-transparent outline-none" />
                </div>
              </label>
            </div>

            <label className="mt-4 block text-xs font-medium text-slate-500">
              Bio
              <textarea
                placeholder="Escribe una biografía ej. tus hobbies, intereses, etc."
                rows={3}
                className="input-field mt-1 resize-none bg-slate-50"
              />
            </label>

            <div className="mt-6 flex items-center gap-4">
              <button className="rounded-xl bg-gesty-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-gesty-orange-dark">
                Actualizar
              </button>
              <button type="reset" className="text-sm font-medium text-slate-500">
                Resetear
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-10 text-sm text-slate-400">
            Sección "{tab}" — pantalla estática de este prototipo.
          </div>
        )}
      </div>
    </AppShell>
  );
}
