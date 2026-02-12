import { Link } from 'react-router-dom';
import { backArrow } from '../assets/svg-icons';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to = '/', label = 'Atrás' }: BackButtonProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-primary font-bold text-2xl hover:opacity-80 transition-opacity"
    >
      <img src={backArrow} alt="" className="w-30 h-30" />
      <span>{label}</span>
    </Link>
  );
}

