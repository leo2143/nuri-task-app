import { Link } from 'react-router-dom';
import { userService } from '../services/userService';

export default function Navbar() {
  // Obtener información del usuario desde localStorage
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = authToken !== null;
  
  let userName = '';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userName = user.name || user.email || 'Usuario';
    }
  } catch (error) {
    console.error('Error al parsear usuario:', error);
  }

  const handleLogout = () => {
    localStorage.removeItem('user'); // También limpiamos el usuario
    userService.logout();
  };

  return (
    <header className="bg-primary text-base shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">
            <Link to="/" className="text-base hover:text-warmth transition-colors duration-200">
              Nuri Task App
            </Link>
          </h1>
          
          <ul className="flex gap-6 font-body items-center">
            <li>
              <Link 
                to="/" 
                className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                to="/tasks" 
                className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
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
                      className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
                    >
                      {userName}
                    </Link>
                  </li>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
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
                    className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="text-base hover:text-warmth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warmth focus:ring-offset-2 rounded px-2 py-1"
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

