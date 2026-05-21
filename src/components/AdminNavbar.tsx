import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  hamburger,
  home,
  homeBrown,
  medalBrown,
  medal,
  profile,
  profileBrown,
} from "../assets/svg-icons";
import { nuriConNenu } from "../assets/ilustrations";
import MenuNavItem from "./MenuNavItem";
import BackButton from "./BackButton";
import SideDrawer from "./SideDrawer";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const isAdminHome = location.pathname === '/admin';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-neutral text-neutral w-full fixed top-0 z-30">
        <h1 className="sr-only">Nuri task Admin</h1>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {isAdminHome ? (
              <>
                <div className="flex items-center gap-2">
                  <img
                    className="h-10 w-10"
                    src={nuriConNenu}
                    alt="ícono de nuri"
                  />
                  <span className="font-heading text-tertiary text-xl font-bold">
                    Panel de Administración
                  </span>
                </div>
                <button className="p-4" onClick={() => setIsMenuOpen(true)}>
                  <img src={hamburger} alt="ícono de menú" className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <BackButton to="/admin" />
                <button className="p-4" onClick={() => setIsMenuOpen(true)}>
                  <img src={hamburger} alt="ícono de menú" className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} ariaLabel="Administrador">
        <MenuNavItem to="/admin/users" icon={profileBrown} iconHover={profile} label="Usuarios" />
        <MenuNavItem to="/admin/achievements" icon={medalBrown} iconHover={medal} label="Logros" />
        <MenuNavItem to="/" icon={homeBrown} iconHover={home} label="Volver al Inicio" />
      </SideDrawer>
    </>
  );
}
