import { Link } from "react-router-dom";
import { IconWrapper } from "./ui";
import { crown } from "../assets/svg-icons";

interface MenuNavItemProps {
  to: string;
  icon: string;
  iconHover: string;
  iconClass?: string;
  label?: string;
  whitHover?: boolean;
  whitelabel?: boolean;
  showCrown?: boolean;
}

export default function MenuNavItem({
  to,
  icon,
  iconHover,
  iconClass = "",
  label,
  whitHover = true,
  whitelabel = true,
  showCrown = false,
}: MenuNavItemProps) {
  const hoverStyle = whitHover
    ? " hover:bg-brand hover:text-neutral transition-colors duration-200"
    : "";
  const labelStyle = whitelabel ? "block" : "hidden";
  return (
    <Link to={to} viewTransition>
      <div
        className={`w-full flex items-center gap-2 text-tertiary rounded-2xl p-2 group ${hoverStyle}`}
      >
        <IconWrapper
          src={icon}
          alt={label || "label del ícono"}
          className={`group-hover:hidden transition-all ${iconClass}`}
        />
        <IconWrapper
          src={iconHover}
          alt={label || "label del ícono"}
          className={`hidden group-hover:block transition-all ${iconClass}`}
        />
        <span className={labelStyle}>{label}</span>
        {showCrown && (
          <span className="ml-auto flex items-center">
            <img src={crown} alt="" className="w-5 h-auto" />
            <span className="sr-only">Premium</span>
          </span>
        )}
      </div>
    </Link>
  );
}
