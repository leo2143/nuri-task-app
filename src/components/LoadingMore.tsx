import { Spinner } from "./ui";

interface LoadingMoreProps {
  message?: string;
}

export default function LoadingMore({
  message = "Cargando más...",
}: LoadingMoreProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Spinner size="lg" />
      <span className="font-body text-sm text-tertiary/70">{message}</span>
    </div>
  );
}
