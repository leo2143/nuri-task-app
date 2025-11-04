import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-tertiary mb-4">
          Bienvenido a Nuri Task App
        </h1>
        <p className="text-xl font-body text-tertiary">
          Gestiona tus tareas de manera eficiente y mantente organizado
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6 mt-12">
        <article className="bg-white p-6 rounded-lg shadow-md border border-neutral hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-2xl font-heading font-semibold text-tertiary mb-3">
            Crear Tareas
          </h2>
          <p className="font-body text-tertiary mb-4">
            Crea y organiza fácilmente tus tareas diarias con nuestra interfaz
            intuitiva.
          </p>
          <Link to="/tasks">
            <Button type="button" variant="primary" size="sm">
              Ver Tareas
            </Button>
          </Link>
        </article>

        <article className="bg-white p-6 rounded-lg shadow-md border border-neutral hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-2xl font-heading font-semibold text-tertiary mb-3">
            Seguimiento de Progreso
          </h2>
          <p className="font-body text-tertiary mb-4">
            Monitorea tu progreso y mantente al tanto de tus objetivos con un
            seguimiento detallado.
          </p>
          <Link to="/tasks">
            <Button type="button" variant="secondary" size="sm">
              Comenzar
            </Button>
          </Link>
        </article>
      </section>

      <section className="mt-12 bg-secondary bg-opacity-20 p-6 rounded-lg border border-secondary">
        <h2 className="text-2xl font-heading font-semibold text-tertiary mb-4">
          Características
        </h2>
        <ul className="space-y-2 font-body text-tertiary">
          <li className="flex items-center">
            <span className="mr-2 text-primary font-bold">✓</span>
            <span>
              <strong className="text-tertiary">Gestión fácil de tareas</strong>{" "}
              - Crea, edita y elimina tareas
            </span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary font-bold">✓</span>
            <span>
              <strong className="text-tertiary">
                Flujo de trabajo organizado
              </strong>{" "}
              - Mantén tus tareas estructuradas
            </span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary font-bold">✓</span>
            <span>
              <strong className="text-tertiary">Diseño responsivo</strong> -
              Funciona en todos los dispositivos
            </span>
          </li>
        </ul>
      </section>
    </article>
  );
}
