import { Link, useNavigate } from 'react-router-dom';
import { backArrow } from '../assets/svg-icons';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Atrás' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  if (to) {
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

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 text-primary font-bold text-2xl hover:opacity-80 transition-opacity"
    >
      <img src={backArrow} alt="" className="w-30 h-30" />
      <span>{label}</span>
    </button>
  );
}

