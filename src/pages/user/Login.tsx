import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { ILoginUser } from '../../interfaces/IUser';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import { useField } from '../../hooks/useField';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Usar el custom hook useField para cada campo
  const email = useField('email');
  const password = useField('password');

  const validar = (): string | null => {
    if (!email.value.trim()) {
      return 'El email es obligatorio';
    }
    
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email.value)) {
      return 'El email no es válido';
    }
    
    if (!password.value.trim()) {
      return 'La contraseña es obligatoria';
    }
    
    if (password.value.length < 4) {
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
      const loginData: ILoginUser = {
        email: email.value,
        password: password.value
      };
      const authResponse = await userService.login(loginData);
      
      // 4. Login exitoso
      console.log('Login exitoso:', authResponse);
      console.log('Usuario:', authResponse.user);
      console.log('Token guardado:', authResponse.token);
      
      // 5. Actualizar el contexto de autenticación (esto actualiza el Navbar automáticamente)
      login(authResponse.user, authResponse.token);
      
      // 6. Redirigir al home o dashboard
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
            <Input
              {...email}
              id="email"
              name="email"
              label="Correo Electrónico"
              placeholder="tu.correo@ejemplo.com"
              required
              autoComplete="email"
              disabled={loading}
            />

            {/* Campo Password */}
            <Input
              {...password}
              id="password"
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="current-password"
              disabled={loading}
            />

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
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
            >
              {loading ? 'Iniciando sesión' : 'Iniciar Sesión'}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-base/20">
              <p className="text-contrast/70 font-body">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register"
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
