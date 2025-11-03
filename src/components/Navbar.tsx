import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || user?.email || "Usuario";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">
            <Link
              to="/"
              className="text-white hover:text-secondary transition-colors duration-200"
            >
              Nuri Task App
            </Link>
          </h1>

          <ul className="flex gap-6 font-body items-center">
            <li>
              <Link
                to="/"
                className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
              >
                Tareas
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {userName && (
                  <li>
                    <Link
                      to="/profile"
                      className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
                    >
                      {userName}
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
                    type="button"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white hover:text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
