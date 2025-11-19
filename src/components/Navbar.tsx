import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import {
  nuriFire,
  hamburger,
  notification,
  close,
  starBrown,
  star,
  home,
  homeBrown,
  metrics,
  medalBrown,
  medal,
  metricBrown,
  checkBrown,
  checkBlue,
  iconLogout,
  iconLogoutBrown,
  profile,
  profileBrown,
} from "../assets/svg-icons";
import MenuNavItem from "./MenuNavItem";

export default function Navbar() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHamburger = () => {
    console.log("hamburger");
    setIsMenuOpen(!isMenuOpen);
  };
  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // quitar y poner scroll del body cuando cuando abro el menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-neutral text-neutral w-full fixed top-0">
        <h1 className="hidden">Nuri task</h1>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={nuriFire} alt="ícono de fuego de Nuri" />
              <span className="font-heading text-tertiary text-4xl font-bold">
                3
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/notifications">
                <div className="p-4">
                  <img src={notification} alt="ícono de notificaciones" />
                </div>
              </Link>
              <button className="p-4" onClick={handleHamburger}>
                <img src={hamburger} alt="ícono de menú" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed top-0 right-0 h-full w-full bg-neutral shadow-2xl z-50 md:w-80 overflow-y-auto">
            <div className="py-6 flex flex-col gap-20 min-h-full">
              <div>
                <div className="flex items-center justify-between mb-6 px-6">
                  <h2 className="text-2xl font-heading text-tertiary">Menú</h2>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-tertiary hover:text-primary transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
                    aria-label="Cerrar menú"
                  >
                    <img
                      src={close}
                      alt="ícono de cerrar"
                      className="h-6 w-6"
                    />
                  </button>
                </div>
                <div className="flex flex-col gap-2 ">
                  <MenuNavItem
                    to="/"
                    icon={homeBrown}
                    iconHover={home}
                    label="Inicio"
                  />
                  <MenuNavItem
                    to="/"
                    icon={profileBrown}
                    iconHover={profile}
                    label="Perfil"
                  />
                  <MenuNavItem
                    to="/tasks"
                    icon={checkBrown}
                    iconHover={checkBlue}
                    label="Tareas"
                  />

                  <MenuNavItem
                    to="/goals"
                    icon={starBrown}
                    iconHover={star}
                    label="Metas"
                  />
                  <MenuNavItem
                    to="/"
                    icon={metricBrown}
                    iconHover={metrics}
                    label="Métricas"
                  />
                  <MenuNavItem
                    to="/"
                    icon={medalBrown}
                    iconHover={medal}
                    label="Logros"
                  />
                </div>
              </div>
              <div>
                <button className="w-full" onClick={handleLogout}>
                  <MenuNavItem
                    to="/"
                    icon={iconLogoutBrown}
                    iconHover={iconLogout}
                    label="cerrar sesión"
                  />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
