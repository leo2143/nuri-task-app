import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useField } from '../../hooks/useField';
import { Button, Input } from '../../components/ui';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Usar el custom hook useField
  const newPassword = useField('password');
  const confirmPassword = useField('password');

  // Verificar token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError(true);
        setMsgError('Token no proporcionado. Por favor, usa el enlace del email.');
        setVerifying(false);
        return;
      }

      try {
        const response = await userService.verifyResetToken(token);
        
        if (response.valid) {
          setTokenValid(true);
          setUserEmail(response.email || '');
        } else {
          setError(true);
          setMsgError(response.message || 'Token inválido o expirado');
        }
      } catch (error: unknown) {
        console.error('Error verificando token:', error);
        
        let mensajeError = 'Error al verificar el token';
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
          
          if (axiosError.response?.status === 400) {
            mensajeError = 'Token inválido o expirado';
          } else if (axiosError.response?.data?.message) {
            mensajeError = axiosError.response.data.message;
          }
        }
        
        setError(true);
        setMsgError(mensajeError);
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validar = (): string | null => {
    if (!newPassword.value.trim()) {
      return 'La contraseña es obligatoria';
    }
    
    if (newPassword.value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!confirmPassword.value.trim()) {
      return 'Debes confirmar tu contraseña';
    }
    
    if (newPassword.value !== confirmPassword.value) {
      return 'Las contraseñas no coinciden';
    }
    
    return null;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!token) {
      setMsgError('Token no proporcionado');
      setError(true);
      return;
    }
    
    // 1. VALIDAR formulario
    const errorValidacion = validar();
    if (errorValidacion) {
      setMsgError(errorValidacion);
      setError(true);
      return;
    }

    // 2. ACTIVAR loading
    setLoading(true);
    setError(false);
    
    try {
      // 3. LLAMAR al servicio de reset password
      const response = await userService.resetPassword(token, newPassword.value);
      
      // 4. Mostrar éxito y redirigir
      console.log('Contraseña reseteada exitosamente:', response);
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: unknown) {
      // 5. MANEJAR errores
      console.error('Error en reset password:', error);
      
      let mensajeError = 'Error al resetear la contraseña';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 400) {
          mensajeError = 'Token inválido, expirado o ya usado';
        } else if (axiosError.response?.data?.message) {
          mensajeError = axiosError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        mensajeError = error.message;
      }
      
      setError(true);
      setMsgError(mensajeError);
      
    } finally {
      // 6. SIEMPRE desactivar loading
      setLoading(false);
    }
  };

  // Mostrar loading mientras verifica el token
  if (verifying) {
    return <Loading />;
  }

  // Si el token no es válido, mostrar error
  if (!tokenValid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary via-base to-warmth/20 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="text-center">
            <svg 
              className="w-24 h-24 mx-auto text-danger mb-6"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            
            <h1 className="text-3xl font-heading font-bold text-contrast mb-4">
              Token Inválido o Expirado
            </h1>
            
            <div className="mb-6">
              <Alert msg={msgError} />
            </div>
            
            <p className="text-contrast/70 font-body mb-8">
              El enlace de recuperación puede haber expirado o ya fue usado. 
              Los enlaces son válidos por 1 hora.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/forgot-password">
                <Button variant="primary" size="md">
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="md">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Si todo está bien, mostrar formulario o mensaje de éxito
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" 
              />
            </svg>
            <h2 className="text-3xl font-heading font-bold text-contrast mt-6 mb-3">
              Nueva Contraseña
            </h2>
            <p className="text-lg text-contrast/70 font-body">
              Crea una contraseña segura para proteger tu cuenta
            </p>
          </div>
        </div>

        {/* Formulario de Reset Password */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {!success ? (
            <>
              <header className="mb-8">
                <h1 className="text-4xl font-heading font-bold text-contrast mb-2">
                  Restablecer Contraseña
                </h1>
                <p className="text-contrast/60 font-body">
                  {userEmail && (
                    <>Cambiando contraseña para: <strong>{userEmail}</strong></>
                  )}
                </p>
              </header>

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Campo Nueva Contraseña */}
                <Input
                  {...newPassword}
                  id="newPassword"
                  name="newPassword"
                  label="Nueva Contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  helperText="Mínimo 6 caracteres"
                />

                {/* Campo Confirmar Contraseña */}
                <Input
                  {...confirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  placeholder="Confirma tu nueva contraseña"
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
                  {loading ? 'Actualizando contraseña' : 'Restablecer Contraseña'}
                </Button>
              </form>
            </>
          ) : (
            // Mensaje de éxito
            <div className="space-y-6 text-center">
              <svg 
                className="w-24 h-24 mx-auto text-green-500"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              <h2 className="text-3xl font-heading font-bold text-contrast">
                ¡Contraseña Actualizada!
              </h2>
              
              <p className="text-contrast/70 font-body text-lg">
                Tu contraseña ha sido cambiada exitosamente. 
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>
              
              <div className="bg-warmth/10 border border-warmth p-4 rounded-lg">
                <p className="font-body text-sm text-depth">
                  Serás redirigido al login en unos segundos...
                </p>
              </div>
              
              <Link to="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Ir al Login Ahora
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

