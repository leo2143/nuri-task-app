import type { ReactNode } from "react";
import { navButton } from "../assets/svg-icons";
import MenuNavItem from "./MenuNavItem";

export interface FooterNavItem {
  to: string;
  icon: string;
  iconHover: string;
  label: string;
  iconClass?: string;
}

interface FooterBarProps {
  items: FooterNavItem[];
  leadingAction?: ReactNode;
}

export default function FooterBar({ items, leadingAction }: FooterBarProps) {
  return (
    <footer className="w-full bg-neutral fixed bottom-0 z-30">
      <div className="min-h-[60px] max-h-[60px] bg-brand rounded-full text-white m-5 text-center relative flex items-center justify-between">
        {leadingAction ?? (
          <img
            className="w-[60px] h-[60px]"
            src={navButton}
            alt="ícono de botón de navegación"
          />
        )}

        {items.map((item) => (
          <MenuNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            iconHover={item.iconHover}
            whitHover={false}
            whitelabel={false}
            iconClass={item.iconClass}
            label={item.label}
          />
        ))}
      </div>
    </footer>
  );
}
