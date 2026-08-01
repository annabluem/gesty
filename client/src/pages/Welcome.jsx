import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { campusImg } from '../assets/images';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] p-6">
      <div className="flex h-[620px] w-full max-w-[960px] overflow-hidden rounded-2xl border border-gesty-border bg-white shadow-sm">
        <div className="hidden w-1/2 overflow-hidden sm:block">
          <img src={campusImg} alt="Campus USB Cartagena" className="h-full w-full object-cover" />
        </div>

        <div className="flex w-full flex-col justify-center px-10 sm:w-1/2">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-gesty-text">
            ¡Bienvenido a <span className="text-gesty-orange">Gesty!</span>
          </h1>
          <div className="my-4 h-1 w-14 rounded-full bg-gesty-orange" />
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Llegaste a la agenda de la comunidad Bonaventuriana, un espacio donde la
            agilización y organización de los procesos del campus está a tu alcance.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gesty-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gesty-orange-dark"
          >
            Siguiente <ArrowRight size={16} />
          </button>
          <div className="mt-16">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}
