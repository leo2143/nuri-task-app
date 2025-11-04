import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Badge } from "../../components/ui";

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
          <Badge variant="priority" priority={task.priority} />
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
        <Link to="/tasks">
          <Button type="button" variant="secondary" size="md">
            Volver a la Lista
          </Button>
        </Link>
      </footer>
    </article>
  );
}
