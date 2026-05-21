import { Link } from 'react-router-dom';
import { useAppNavigate } from '../hooks';
import { backArrow } from '../assets/svg-icons';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Atrás' }: BackButtonProps) {
  const navigate = useAppNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  if (to) {
    return (
      <Link
        to={to}
        viewTransition
        className="flex items-center gap-2 text-primary font-bold text-2xl hover:opacity-80 transition-opacity"
      >
        <img src={backArrow} alt="" className="w-7 h-7" />
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
      <img src={backArrow} alt="" className="w-7 h-7" />
      <span>{label}</span>
    </button>
  );
}

