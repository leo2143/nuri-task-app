import {
  navButton,
  home,
  homeBrown,
  profile,
  profileBrown,
  medalBrown,
  medal,
} from "../assets/svg-icons";
import MenuNavItem from "./MenuNavItem";

export default function AdminFooter() {
  return (
    <footer className="w-full bg-neutral fixed bottom-0 z-30">
      <div className="min-h-[60px] max-h-[60px]   bg-brand rounded-full text-white m-5  text-center relative flex items-center justify-between">
        <img
          className="h-full"
          src={navButton}
          alt="ícono de botón de navegación"
        />
        <MenuNavItem
          to="/admin"
          icon={home}
          iconHover={homeBrown}
          whitHover={false}
          whitelabel={false}
          label="Inicio"
        />
        <MenuNavItem
          to="/admin/users"
          icon={profile}
          iconHover={profileBrown}
          whitHover={false}
          whitelabel={false}
          label="Perfil"
        />
        <MenuNavItem
          to="/admin/achievements"
          icon={medal}
          iconHover={medalBrown}
          whitHover={false}
          whitelabel={false}
          label="Logros"
        />
      </div>
    </footer>
  );
}
