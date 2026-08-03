import { logoImg } from '../assets/images';

export default function Logo({ className = '' }) {
  return (
    <img
      src={logoImg}
      alt="Gesty"
      className={`h-9 w-32 object-cover object-center mix-blend-multiply ${className}`}
    />
  );
}
