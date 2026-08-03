import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { registroFondoImg } from '../assets/images';

export default function Register() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/app/inicio');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaf3f8] p-6">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-gesty-border bg-white shadow-sm">
        <div className="hidden w-1/3 overflow-hidden sm:block">
          <img src={registroFondoImg} alt="" className="h-full w-full object-cover" />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex-1 p-10">
          <h2 className="font-display text-2xl font-bold text-gesty-text">Crear Cuenta</h2>
          <p className="mt-1 text-sm text-slate-400">Completa los datos para continuar</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <input placeholder="Nombres" className="input-field" />
            <input placeholder="Apellidos" className="input-field" />
          </div>
          <input placeholder="Nombre de usuario" className="input-field mt-3 border-gesty-orange" />
          <input placeholder="Correo Electrónico Institucional" className="input-field mt-3" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input placeholder="No. de Identificación" className="input-field" />
            <input placeholder="Fecha de Nacimiento" type="date" className="input-field text-slate-400" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="relative">
              <input placeholder="Contraseña" type="password" className="input-field" />
              <Eye size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <input placeholder="Confirmar Contraseña" type="password" className="input-field" />
              <Eye size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-gesty-orange">
              Inicia Sesión
            </Link>
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gesty-orange text-white transition-colors hover:bg-gesty-orange-dark"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Al registrarte, aceptas los{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gesty-orange">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-gesty-orange">
              política de privacidad
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
