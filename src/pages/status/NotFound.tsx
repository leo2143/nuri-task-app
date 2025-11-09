import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <article className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <header className="mb-8">
          <h2 className="text-9xl font-heading font-bold text-secondary opacity-50">
            404
          </h2>
          <h3 className="text-3xl font-heading font-semibold text-tertiary mb-4">
            Página No Encontrada
          </h3>
          <p className="text-xl font-body text-tertiary mb-8">
            <em>¡Oops! La página que buscas no existe.</em>
          </p>
        </header>

        <nav className="mb-12">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Volver al Inicio
          </Link>
        </nav>

        <section className="mt-12 bg-secondary bg-opacity-10 p-6 rounded-lg border border-secondary inline-block">
          <h4 className="text-lg font-heading font-medium text-tertiary mb-4">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2 font-body">
            <li>
              <Link
                to="/"
                className="text-primary hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 inline-block transition-colors duration-200"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="text-primary hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 inline-block transition-colors duration-200"
              >
                Tareas
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
