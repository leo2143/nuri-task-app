import { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui";
import { useAuth } from "../../hooks";
import { userService } from "../../services/userService";
import { nuriManitoJuntas } from "../../assets/ilustrations";
import TramaBlue from "../../assets/icons/trama-blue.svg";

export default function VerifyEmailPending() {
  const { user, logout } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

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
      await userService.resendVerification(user.email);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <img
        src={TramaBlue}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full gap-6">
        <img
          src={nuriManitoJuntas}
          alt="Nuri esperando"
          className="w-40 h-40 object-contain"
        />

        <h1 className="text-3xl font-heading font-bold text-tertiary">
          ¡Revisá tu email!
        </h1>

        <p className="text-lg font-body text-tertiary/80">
          Te enviamos un enlace de verificación a{" "}
          <span className="font-bold text-primary">{user?.email}</span>.
          Hacé clic en el enlace para activar tu cuenta.
        </p>

        <div className="bg-white/80 rounded-xl p-4 w-full border border-primary/20">
          <p className="text-sm font-body text-tertiary/70">
            El enlace expira en <span className="font-bold">1 hora</span>.
            Si no lo encontrás, revisá la carpeta de spam.
          </p>
        </div>

        {message && (
          <p className="text-sm font-body font-semibold text-primary">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={handleResend}
            disabled={cooldown > 0 || sending}
            loading={sending}
            variant="primary"
            fullWidth
          >
            {cooldown > 0
              ? `Reenviar en ${cooldown}s`
              : "Reenviar email de verificación"}
          </Button>

          <Button onClick={handleLogout} variant="ghost" fullWidth>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
