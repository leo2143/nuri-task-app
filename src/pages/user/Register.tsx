import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import type { ICreateUser } from '../../interfaces/IUser';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import { useField } from '../../hooks/useField';
import { Button, Input } from '../../components/ui';

export default function Register() {

  const navigate = useNavigate();
  
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Usar el custom hook useField para cada campo
  const name = useField('text');
  const email = useField('email');
  const password = useField('password');
  const confirmPassword = useField('password');

  const validar = (): string | null => {
    if (!name.value.trim()) {
      return 'El nombre es obligatorio';
    }
    
    if (name.value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    
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
    
    if (!confirmPassword.value.trim()) {
      return 'Debes confirmar tu contraseña';
    }
    
    if (password.value !== confirmPassword.value) {
      return 'Las contraseñas no coinciden';
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
      // 3. Preparar datos del usuario
      const userData: ICreateUser = {
        name: name.value,
        email: email.value,
        password: password.value
      };
      
    // TODO: SEGUIR VALIDANDO Y CORRIGIENDO LAS LLAMADAS PARA QUE UTILICE ESTE MODELO SIEMPRE

      // 4. LLAMAR al servicio de registro
      const newUser = await userService.register(userData);
      
      if (newUser.status === 409) {
        setError(true);
        setMsgError('Este email ya está registrado. ¿Deseas iniciar sesión?');
        return;
      }
      
      // 5. Registro exitoso
      console.log('Usuario creado exitosamente:', newUser);
      
      // 6. Redirigir al login
      navigate('/user/login');
      
    } catch (error: unknown) {
      // 8. MANEJAR errores
      console.error('Error en registro:', error);
      
      // Extraer mensaje de error del backend
      let mensajeError = 'Error al crear la cuenta';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number; 
            data?: { message?: string; conflict?: { field?: string } } 
          } 
        };
        
        // Conflicto (409) - Email o recurso duplicado
        if (axiosError.response?.status === 409) {
          const field = axiosError.response.data?.conflict?.field;
          if (field === 'email') {
            mensajeError = 'Este email ya está registrado. ¿Deseas iniciar sesión?';
          } else {
            mensajeError = 'El recurso ya existe';
          }
        } 
        // Solicitud incorrecta (400)
        else if (axiosError.response?.status === 400) {
          mensajeError = 'Datos inválidos. Verifica la información ingresada';
        } 
        // Mensaje personalizado del backend
        else if (axiosError.response?.data?.message) {
          mensajeError = axiosError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        mensajeError = error.message;
      }
      
      setError(true);
      setMsgError(mensajeError);
      
    } finally {
      // 9. SIEMPRE desactivar loading
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
              ¡Únete a Nosotros!
            </h2>
            <p className="text-lg text-contrast/70 font-body">
              Crea tu cuenta y comienza a gestionar tus tareas de manera eficiente
            </p>
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-contrast mb-2">
              Crear Cuenta
            </h1>
            <p className="text-contrast/60 font-body">
              Ingresa tus datos para registrarte
            </p>
          </header>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Campo Nombre */}
            <Input
              {...name}
              id="name"
              name="name"
              label="Nombre Completo"
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              disabled={loading}
            />

            {/* Campo Email */}
            <Input
              {...email}
              id="email"
              name="email"
              label="Correo Electrónico"
              placeholder="tu.correo@ejemplo.com"
              required
              autoComplete="username email"
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
              autoComplete="new-password"
              disabled={loading}
              helperText="Mínimo 4 caracteres"
            />

            {/* Campo Confirmar Password */}
            <Input
              {...confirmPassword}
              id="confirm_password"
              name="confirm_password"
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              required
              autoComplete="new-password"
              disabled={loading}
            />

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
              {loading ? 'Creando cuenta' : 'Crear Cuenta'}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-base/20">
              <p className="text-contrast/70 font-body">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login"
                  className="text-primary hover:text-warmth font-semibold 
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 rounded px-1"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
