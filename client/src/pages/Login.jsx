import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Prototipo: no hay autenticación real, solo navega al inicio.
    navigate('/app/inicio');
  }

  return (
    <div className="flex min-h-screen items-center bg-gradient-to-br from-[#eaf6ff] to-[#cfe9fb] px-6 py-10 sm:px-16">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="max-w-md">
          <Logo className="mb-10" />
          <h1 className="font-display text-4xl font-bold leading-tight text-gesty-text">
            Tu portal hacia
            <br />
            una comunidad
            <br />
            <span className="text-gesty-orange">más conectada.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-slate-500">
            Gesty es el espacio donde la agilización y organización de los procesos del
            campus está a tu alcance.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        >
          <h2 className="font-display text-xl font-bold text-gesty-text">Iniciar Sesión</h2>
          <p className="mt-1 text-sm text-slate-400">¡Bienvenido(a) de vuelta!</p>

          <label className="mt-6 block">
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full rounded-xl border border-gesty-border px-4 py-2.5 text-sm outline-none focus:border-gesty-orange"
            />
          </label>

          <label className="relative mt-3 block">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="w-full rounded-xl border border-gesty-border px-4 py-2.5 pr-10 text-sm outline-none focus:border-gesty-orange"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </label>

          <div className="mt-3 flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-slate-500">
              <input type="checkbox" className="accent-gesty-orange" />
              Recuérdame
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-gesty-orange">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-gesty-orange py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gesty-orange-dark"
          >
            Iniciar Sesión
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-gesty-border" />
            O sino
            <div className="h-px flex-1 bg-gesty-border" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/app/inicio')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gesty-border py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
              O
            </span>{' '}
            Iniciar sesión con Outlook
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-gesty-orange">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
