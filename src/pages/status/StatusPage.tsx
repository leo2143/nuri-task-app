import { Link } from "react-router-dom";

interface StatusPageProps {
  code: string;
  title: string;
  message: string;
  homeLabel?: string;
}

export default function StatusPage({
  code,
  title,
  message,
  homeLabel = "Volver al inicio",
}: StatusPageProps) {
  return (
    <article className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-heading font-bold text-secondary opacity-50">
            {code}
          </h1>
          <h2 className="text-3xl font-heading font-semibold text-tertiary mb-4">
            {title}
          </h2>
          <p className="text-xl font-body text-tertiary mb-8">
            <em>{message}</em>
          </p>
        </div>

        <div className="mb-12">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
