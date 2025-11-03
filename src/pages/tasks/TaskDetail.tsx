import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulando datos de tarea (en una app real vendría de un estado o API)
  const task = {
    id,
    title: `Tarea #${id}`,
    description:
      "Esta es una descripción detallada de la tarea. Puedes agregar más información sobre qué necesita hacerse, plazos y cualquier otro detalle relevante.",
    completed: false,
    createdAt: new Date().toLocaleDateString(),
    priority: "high" as const,
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-secondary bg-opacity-30 text-tertiary border-secondary";
      case "low":
        return "bg-secondary bg-opacity-30 text-primary-dark border-secondary";
      default:
        return "bg-neutral text-tertiary border-neutral";
    }
  };

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <nav className="mb-4">
          <Button
            type="button"
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            ← Volver a Tareas
          </Button>
        </nav>

        <h1 className="text-3xl font-heading font-bold text-tertiary mb-2">
          {task.title}
        </h1>

        <div className="flex items-center gap-4 text-sm font-body text-tertiary">
          <time dateTime={task.createdAt} className="flex items-center gap-1">
            <span className="font-semibold">Creada:</span> {task.createdAt}
          </time>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(task.priority)}`}
          >
            Prioridad{" "}
            {task.priority === "high"
              ? "Alta"
              : task.priority === "medium"
                ? "Media"
                : "Baja"}
          </span>
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow border border-neutral mb-6">
        <h2 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Descripción
        </h2>
        <p className="font-body text-tertiary leading-relaxed">
          {task.description}
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow border border-neutral mb-6">
        <h2 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Estado
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="task-completed"
            checked={task.completed}
            readOnly
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="Estado de completitud de la tarea"
          />
          <label
            htmlFor="task-completed"
            className="text-lg font-body text-tertiary cursor-pointer"
          >
            {task.completed ? (
              <span>
                <strong className="text-tertiary">Completada</strong> ✓
              </span>
            ) : (
              <span>Aún no completada</span>
            )}
          </label>
        </div>
      </section>

      <footer className="flex flex-wrap gap-4">
        <Button type="button" variant="primary" size="md">
          Editar Tarea
        </Button>
        <Button type="button" variant="danger" size="md">
          Eliminar Tarea
        </Button>
        <Link
          to="/tasks"
          className="px-6 py-3 bg-secondary text-white font-body font-medium rounded-lg hover:bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors duration-200 inline-flex items-center justify-center shadow-md hover:shadow-lg"
        >
          Volver a la Lista
        </Link>
      </footer>
    </article>
  );
}
