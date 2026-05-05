import {
  navButton,
  home,
  homeBrown,
  profile,
  profileBrown,
  medalBrown,
  medal,
} from "../assets/svg-icons";
import FooterBar, { type FooterNavItem } from "./FooterBar";
import ActionSelect, { type ActionOption } from "./ui/ActionSelect";

const items: FooterNavItem[] = [
  { to: "/admin", icon: home, iconHover: homeBrown, label: "Inicio" },
  { to: "/admin/users", icon: profile, iconHover: profileBrown, label: "Perfil" },
  { to: "/admin/achievements", icon: medal, iconHover: medalBrown, label: "Logros", iconClass: "scale-125" },
];

const adminActions: ActionOption[] = [
  { id: "create-user", title: "Crear usuario", icon: profile, path: "/admin/users/new" },
  { id: "create-achievement", title: "Crear logro", icon: medal, path: "/admin/achievements/new" },
];

export default function AdminFooter() {
  return (
    <FooterBar
      items={items}
      leadingAction={
        <ActionSelect options={adminActions}>
          <img
            className="w-[60px] h-[60px] cursor-pointer"
            src={navButton}
            alt="ícono de botón de navegación"
          />
        </ActionSelect>
      }
    />
  );
}
