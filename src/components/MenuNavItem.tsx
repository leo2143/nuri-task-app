import { Link } from "react-router-dom";
import { IconWrapper } from "./ui";

interface MenuNavItemProps {
  to: string;
  icon: string;
  iconHover: string;
  label: string;
}

export default function MenuNavItem({
  to,
  icon,
  iconHover,
  label,
}: MenuNavItemProps) {
  return (
    <Link to={to}>
      <div className="w-full flex items-center gap-2 text-tertiary group hover:bg-brand hover:text-neutral transition-colors duration-200 rounded-lg p-2">
        <IconWrapper
          src={icon}
          alt={label}
          className="group-hover:hidden transition-all"
        />
        <IconWrapper
          src={iconHover}
          alt={label}
          className="hidden group-hover:block transition-all"
        />
        <span>{label}</span>
      </div>
    </Link>
  );
}
