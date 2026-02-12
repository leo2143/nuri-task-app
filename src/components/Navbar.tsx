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
import BackButton from "./BackButton";
import { metricsService } from "../services/metricsService";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
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
  const isHome = location.pathname === '/';


  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/') {
      const loadStreak = async () => {
        try {
          const data = await metricsService.getUserStreak();
          setCurrentStreak(data.currentStreak);
        } catch (error) {
          console.error("Error loading streak:", error);
        }
      };
      loadStreak();
    }
  }, [location.pathname]);

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
      <header className="bg-neutral text-neutral w-full fixed top-0 z-30 py-8 mb-16">
        <h1 className="sr-only">Nuri task</h1>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {isHome ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={nuriFire} alt="ícono de fuego de Nuri" />
                  <span className="font-heading text-tertiary text-4xl font-bold">
                    {currentStreak}
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
              </>
            ) : (
              <>
                <BackButton />
                <button className="p-4" onClick={handleHamburger}>
                  <img src={hamburger} alt="ícono de menú" />
                </button>
              </>
            )}
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
                  <h2 className="font-heading text-tertiary">Menú</h2>

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
                    to="/profile"
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
                    to="/metrics"
                    icon={metricBrown}
                    iconHover={metrics}
                    label="Métricas"
                  />
                  <MenuNavItem
                    to="/achievements"
                    icon={medalBrown}
                    iconHover={medal}
                    label="Logros"
                  />
                  {user?.isAdmin && (
                    <MenuNavItem
                      to="/admin"
                      icon={profileBrown}
                      iconHover={profile}
                      label="Panel Administracion"
                    />
                  )}
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
