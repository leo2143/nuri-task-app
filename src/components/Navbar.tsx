import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import {
  nuriFire,
  hamburger,
  notification,
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
  profile,
  profileBrown,
  heartBlue,
  heart,
} from "../assets/svg-icons";
import MenuNavItem from "./MenuNavItem";
import BackButton from "./BackButton";
import SideDrawer from "./SideDrawer";
import { metricsService } from "../services/metricsService";
import { notificationApiService } from "../services/notificationApiService";

export default function Navbar() {
  const { user, isPremium } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const location = useLocation();
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
    const loadUnread = () => {
      notificationApiService
        .getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    };

    loadUnread();
    const interval = setInterval(loadUnread, 60_000);
    return () => clearInterval(interval);
  }, [location.pathname]);


  return (
    <>
      <header className="bg-neutral text-neutral w-full fixed top-0 z-30 py-8 mb-16">
        <h1 className="sr-only">Nuri task</h1>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {isHome ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={nuriFire} alt="ícono de fuego de Nuri" className="w-10 h-10" />
                  <span className="font-heading text-tertiary text-4xl font-bold">
                    {currentStreak}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Link to="/notifications" viewTransition className="relative p-4">
                    <img src={notification} alt="ícono de notificaciones" className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <button className="p-4" onClick={() => setIsMenuOpen(true)}>
                    <img src={hamburger} alt="ícono de menú" className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <BackButton />
                <button className="p-4" onClick={() => setIsMenuOpen(true)}>
                    <img src={hamburger} alt="ícono de menú" className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <SideDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} ariaLabel="Menú">
        <MenuNavItem to="/" icon={homeBrown} iconHover={home} label="Inicio" />
        <MenuNavItem to="/profile" icon={profileBrown} iconHover={profile} label="Perfil" />
        <MenuNavItem to="/tasks" icon={checkBrown} iconHover={checkBlue} label="Tareas" />
        <MenuNavItem to="/goals" icon={starBrown} iconHover={star} label="Metas" />
        <MenuNavItem to="/metrics" icon={metricBrown} iconHover={metrics} label="Métricas" badge={isPremium ? undefined : "PRO"} />
        <MenuNavItem to="/moodboard" icon={heartBlue} iconHover={heart} label="Moodboard" badge={isPremium ? undefined : "PRO"} />
        <MenuNavItem to="/achievements" icon={medalBrown} iconHover={medal} label="Logros" />
        {user?.isAdmin && (
          <MenuNavItem to="/admin" icon={profileBrown} iconHover={profile} label="Panel Administracion" />
        )}
      </SideDrawer>
    </>
  );
}
