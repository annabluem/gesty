import { logoImg } from '../assets/images';

// El archivo exportado de Figma trae un lienzo alto con mucho margen
// blanco alrededor de la marca; se recorta con object-cover a una caja
// panoramica y se funde el fondo blanco con mix-blend-multiply.
export default function Logo({ className = '' }) {
  return (
    <img
      src={logoImg}
      alt="Gesty"
      className={`h-9 w-32 object-cover object-center mix-blend-multiply ${className}`}
    />
  );
}
