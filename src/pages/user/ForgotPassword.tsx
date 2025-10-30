import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useField } from '../../hooks/useField';
import { Button, Input } from '../../components/ui';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function ForgotPassword() {
  const [error, setError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Usar el custom hook useField
  const email = useField('email');

  const validar = (): string | null => {
    if (!email.value.trim()) {
      return 'El email es obligatorio';
    }
    
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email.value)) {
      return 'El email no es válido';
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
      setSuccess(false);
      return;
    }

    // 2. ACTIVAR loading
    setLoading(true);
    setError(false);
    setSuccess(false);
    
    try {
      // 3. LLAMAR al servicio de forgot password
      const response = await userService.forgotPassword(email.value);
      
      // 4. Mostrar mensaje de éxito
      console.log('Solicitud de recuperación enviada:', response);
      setSuccess(true);
      setSuccessMessage(
        'Si el email existe en nuestro sistema, recibirás un correo con instrucciones para recuperar tu contraseña.'
      );
      
      // En desarrollo, mostrar el token en consola
      if (response.devToken) {
        console.log('🔑 Token de desarrollo:', response.devToken);
        console.log(`🔗 Link directo: /reset-password?token=${response.devToken}`);
      }
      
    } catch (error: unknown) {
      // 5. MANEJAR errores
      console.error('Error en forgot password:', error);
      
      // Extraer mensaje de error del backend
      let mensajeError = 'Error al solicitar recuperación de contraseña';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 429) {
          mensajeError = 'Demasiados intentos. Por favor, espera unos minutos e intenta de nuevo.';
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
              ¿Olvidaste tu Contraseña?
            </h2>
            <p className="text-lg text-contrast/70 font-body">
              No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta
            </p>
          </div>
        </div>

        {/* Formulario de Forgot Password */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-contrast mb-2">
              Recuperar Contraseña
            </h1>
            <p className="text-contrast/60 font-body">
              Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña
            </p>
          </header>

          {!success ? (
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
                helperText="Ingresa el email con el que te registraste"
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
                {loading ? 'Enviando' : 'Enviar Instrucciones'}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-base/20">
                <p className="text-contrast/70 font-body">
                  ¿Recordaste tu contraseña?{' '}
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
          ) : (
            // Mensaje de éxito
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg 
                    className="w-6 h-6 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2">
                      ¡Email Enviado!
                    </h3>
                    <p className="font-body text-sm">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-warmth/10 border border-warmth p-4 rounded-lg">
                <h4 className="font-heading font-semibold text-contrast mb-2">
                  📬 Revisa tu bandeja de entrada
                </h4>
                <ul className="font-body text-sm text-depth space-y-1 list-disc list-inside">
                  <li>El email puede tardar unos minutos en llegar</li>
                  <li>Revisa tu carpeta de spam o correo no deseado</li>
                  <li>El enlace es válido por 1 hora</li>
                </ul>
              </div>

              <Button
                type="button"
                onClick={() => setSuccess(false)}
                variant="secondary"
                size="md"
                fullWidth
              >
                Enviar Otro Email
              </Button>

              <div className="text-center pt-4 border-t border-base/20">
                <Link 
                  to="/login"
                  className="text-primary hover:text-warmth font-semibold font-body
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-primary/50 rounded px-1"
                >
                  ← Volver al Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

