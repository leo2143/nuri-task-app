import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { ILoginUser } from '../../interfaces/IUser';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function Login() {

  const navigate = useNavigate();
  
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ILoginUser>({ 
    email: '', 
    password: '' 
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(false);
    setMsgError('');
  };

  const validar = (): string | null => {
    if (!form.email.trim()) {
      return 'El email es obligatorio';
    }
    
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(form.email)) {
      return 'El email no es válido';
    }
    
    if (!form.password.trim()) {
      return 'La contraseña es obligatoria';
    }
    
    if (form.password.length < 4) {
      return 'La contraseña debe tener al menos 4 caracteres';
    }
    
    return null;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 1. VALIDAR formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setMsgError(errorValidacion);
      setError(true);
      return;
    }

    // 2. ACTIVAR loading
    setLoading(true);
    
    try {
      // 3. LLAMAR al servicio de login
      // IMPORTANTE: El servicio automáticamente guarda el token en localStorage
      const authResponse = await userService.login(form);
      
      // 4. Login exitoso
      console.log('Login exitoso:', authResponse);
      console.log('Usuario:', authResponse.user);
      console.log('Token guardado:', authResponse.token);
      
      // 5. Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      // 6. Limpiar formulario
      setForm({ email: '', password: '' });
      
      // 7. Redirigir al home o dashboard
      navigate('/');
      
    } catch (error: unknown) {
      // 7. MANEJAR errores
      console.error('Error en login:', error);
      
      // Extraer mensaje de error del backend
      let mensajeError = 'Error al iniciar sesión';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 401) {
          mensajeError = 'Email o contraseña incorrectos';
        } else if (axiosError.response?.status === 404) {
          mensajeError = 'Usuario no encontrado';
        } else if (axiosError.response?.data?.message) {
          mensajeError = axiosError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        mensajeError = error.message;
      }
      
      setError(true);
      setMsgError(mensajeError);
      
    } finally {
      // 8. SIEMPRE desactivar loading
      setLoading(false);
    }
  };






  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-base to-warmth/20 flex items-center justify-center px-4 py-12">
      {loading && <Loading />}

      <section className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Ilustración / Imagen lateral */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl">
          <div className="text-center">
            <svg 
              className="w-64 h-64 mx-auto text-primary opacity-80"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-3xl font-heading font-bold text-contrast mt-6 mb-3">
              ¡Bienvenido de Nuevo!
            </h2>
            <p className="text-lg text-contrast/70 font-body">
              Gestiona tus tareas de manera eficiente y aumenta tu productividad
            </p>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-contrast mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-contrast/60 font-body">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </header>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-contrast font-body"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                aria-required="true"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border-2 border-base/30 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                  disabled:bg-base/10 disabled:cursor-not-allowed
                  transition-all duration-200 font-body text-contrast
                  placeholder:text-contrast/40"
                placeholder="tu.correo@ejemplo.com"
              />
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-contrast font-body"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                aria-required="true"
                autoComplete="current-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border-2 border-base/30 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                  disabled:bg-base/10 disabled:cursor-not-allowed
                  transition-all duration-200 font-body text-contrast
                  placeholder:text-contrast/40"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password"
                className="text-sm text-primary hover:text-warmth font-medium 
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-primary/50 rounded px-1"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="animate-shake">
                <Alert msg={msgError} />
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
                py-3 px-6 rounded-lg shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-primary/50
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                font-body text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-base/20">
              <p className="text-contrast/70 font-body">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/user/register"
                  className="text-primary hover:text-warmth font-semibold 
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 rounded px-1"
                >
                  Créala aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
