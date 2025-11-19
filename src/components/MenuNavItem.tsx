import { Link } from "react-router-dom";
import { IconWrapper } from "./ui";

interface MenuNavItemProps {
  to: string;
  icon: string;
  iconHover: string;
  iconClass?: string;
  label?: string;
  whitHover?: boolean;
  whitelabel?: boolean;
}

export default function MenuNavItem({
  to,
  icon,
  iconHover,
  iconClass = "",
  label,
  whitHover = true,
  whitelabel = true,
}: MenuNavItemProps) {
  const hoverStyle = whitHover
    ? " hover:bg-brand hover:text-neutral transition-colors duration-200"
    : "";
  const labelStyle = whitelabel ? "block" : "hidden";
  return (
    <Link to={to}>
      <div
        className={`w-full flex items-center gap-2 text-tertiary rounded-lg p-2 group ${hoverStyle}`}
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
      </div>
    </Link>
  );
}
