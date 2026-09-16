import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, TramaHeader } from "../../components/ui";
import { useAuth } from "../../hooks";
import { userService } from "../../services/userService";
import { nuriManitoJuntas } from "../../assets/ilustrations";

export default function VerifyEmailPending() {
  const { user, logout } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const hasSentInitial = useRef(false);

  useEffect(() => {
    if (!user?.email || hasSentInitial.current) return;
    hasSentInitial.current = true;

    const sendInitial = async () => {
      setSending(true);
      try {
        await userService.resendVerification(user.email);
        setCooldown(60);
      } catch {
        // El email ya fue enviado durante el registro
      } finally {
        setSending(false);
      }
    };
    sendInitial();
  }, [user?.email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (!user?.email || cooldown > 0) return;
    setSending(true);
    setMessage("");
    try {
      await userService.resendVerification(user.email, true);
      setMessage("¡Email reenviado! Revisá tu casilla.");
      setCooldown(60);
    } catch {
      setMessage("No pudimos reenviar el email, intentá de nuevo.");
    } finally {
      setSending(false);
    }
  }, [user?.email, cooldown]);

  const handleLogout = () => {
    logout();
  };

  return (
    <section className="min-h-screen flex flex-col bg-secondary">
      <TramaHeader />

      <div className="relative flex-1 px-8 pt-6 pb-10 flex flex-col items-center justify-center gap-5">
        <img
          src={nuriManitoJuntas}
          alt="Nuri esperando"
          className="w-40 h-40 object-contain"
        />

        <div className="flex flex-col gap-4 items-center w-full">
          <h1 className="text-2xl font-heading font-bold text-neutral text-center">
            ¡Revisá tu email!
          </h1>
          <p className="text-neutral/80 font-body text-center text-sm">
            Te enviamos un enlace de verificación a{" "}
            <span className="font-bold text-primary">{user?.email}</span>. Hacé
            clic en el enlace para activar tu cuenta.
          </p>
          <div className="bg-neutral/10 rounded-xl p-4 w-full border border-neutral/30">
            <p className="text-sm font-body text-neutral/80">
              El enlace expira en <span className="font-bold">1 hora</span>. Si
              no lo encontrás, revisá la carpeta de spam.
            </p>
          </div>
          {message && (
            <p className="text-sm font-body font-semibold text-primary">
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={handleResend}
            disabled={cooldown > 0 || sending}
            loading={sending}
            variant="primary"
            size="md"
            fullWidth
          >
            {cooldown > 0
              ? `Reenviar en ${cooldown}s`
              : "Reenviar email de verificación"}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              onClick={handleLogout}
              className="text-primary font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
