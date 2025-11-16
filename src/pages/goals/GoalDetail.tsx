import { Link, useNavigate } from "react-router-dom";
import { Button, ProgressBar } from "../../components/ui";
import type { IGoal } from "../../interfaces";
import { useFetchById, useFormatDate } from "../../hooks";
import { goalService } from "../../services/goalService";
import Loading from "../../components/Loading";

export default function GoalDetail() {
  const navigate = useNavigate();

  const {
    data: goal,
    loading,
    errorMessage,
  } = useFetchById<IGoal>({
    fetchFn: goalService.getGoalById,
  });

  const createdDate = useFormatDate(goal?.createdAt);
  const dueDate = useFormatDate(goal?.dueDate);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteGoal = async () => {
    if (!goal?._id) {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la meta "${goal.title}"?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    try {
      await goalService.deleteGoal(goal._id);

      // Redirigir a la lista después de eliminar
      navigate("/goals", {
        replace: true,
        state: { message: "Meta eliminada exitosamente" },
      });
    } catch (err) {
      console.error("Error al eliminar meta:", err);
      alert("Error al eliminar la meta. Por favor, intenta de nuevo.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!goal) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-heading font-bold text-tertiary mb-4">
          Meta no encontrada
        </h2>
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          size="md"
        >
          ← Volver a Metas
        </Button>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
        <Button
          type="button"
          onClick={handleGoBack}
          variant="secondary"
          size="md"
        >
          ← Volver a Metas
        </Button>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="mb-4">
          <Button
            type="button"
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            ← Volver a Metas
          </Button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <h2 className="text-3xl font-heading font-bold text-tertiary">
            {goal.title}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              goal.status === "active"
                ? "bg-greenCheap-light text-greenCheap-dark"
                : goal.status === "paused"
                  ? "bg-yellowCheap text-yellow-800"
                  : "bg-blueCheap-light text-blueCheap-dark"
            }`}
          >
            {goal.status === "active"
              ? "Activa"
              : goal.status === "paused"
                ? "Pausada"
                : "Completada"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm font-body text-tertiary">
          {createdDate.isValid && (
            <time
              dateTime={createdDate.iso}
              className="flex items-center gap-1"
            >
              <span className="font-semibold">Creada:</span>{" "}
              {createdDate.formatted}
            </time>
          )}
          {dueDate.isValid && (
            <time dateTime={dueDate.iso} className="flex items-center gap-1">
              <span className="font-semibold">Vence:</span> {dueDate.formatted}
            </time>
          )}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              goal.priority === "high"
                ? "bg-red-100 text-red-800"
                : goal.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {goal.priority === "high"
              ? "Alta"
              : goal.priority === "medium"
                ? "Media"
                : "Baja"}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
        <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Descripción
        </h3>
        <p className="font-body text-tertiary leading-relaxed">
          {goal.description || (
            <em className="text-tertiary opacity-60">Sin descripción</em>
          )}
        </p>
      </div>

      {/* Progreso */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
        <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
          Progreso
        </h3>
        <ProgressBar progress={goal.progress} label="Progreso General" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-tertiary opacity-75 mb-1">Tareas</p>
            <p className="text-lg font-bold text-tertiary">
              {goal.completedTasks}/{goal.totalTasks}
            </p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-tertiary opacity-75 mb-1">Submetas</p>
            <p className="text-lg font-bold text-tertiary">
              {goal.completedSubGoals}/{goal.totalSubGoals}
            </p>
          </div>
        </div>
      </div>

      {/* Criterios SMART (si existen) */}
      {goal.smart && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
          <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
            Criterios SMART
          </h3>
          <dl className="space-y-3">
            {goal.smart.specific && (
              <div>
                <dt className="font-semibold text-tertiary">Específico:</dt>
                <dd className="text-tertiary opacity-75 ml-4">
                  {goal.smart.specific}
                </dd>
              </div>
            )}
            {goal.smart.measurable && (
              <div>
                <dt className="font-semibold text-tertiary">Medible:</dt>
                <dd className="text-tertiary opacity-75 ml-4">
                  {goal.smart.measurable}
                </dd>
              </div>
            )}
            {goal.smart.achievable && (
              <div>
                <dt className="font-semibold text-tertiary">Alcanzable:</dt>
                <dd className="text-tertiary opacity-75 ml-4">
                  {goal.smart.achievable}
                </dd>
              </div>
            )}
            {goal.smart.relevant && (
              <div>
                <dt className="font-semibold text-tertiary">Relevante:</dt>
                <dd className="text-tertiary opacity-75 ml-4">
                  {goal.smart.relevant}
                </dd>
              </div>
            )}
            {goal.smart.timeBound && (
              <div>
                <dt className="font-semibold text-tertiary">
                  Con límite de tiempo:
                </dt>
                <dd className="text-tertiary opacity-75 ml-4">
                  {goal.smart.timeBound}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Comentarios */}
      {goal.comments && goal.comments.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
          <h3 className="text-xl font-heading font-semibold text-tertiary mb-4">
            Comentarios
          </h3>
          <ul className="space-y-3">
            {goal.comments.map((comment, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded border border-gray-300"
              >
                <p className="text-tertiary mb-2">{comment.text}</p>
                <div className="flex items-center gap-2 text-xs text-tertiary opacity-75">
                  <span className="font-semibold">{comment.author}</span>
                  <span>•</span>
                  <time>
                    {new Date(comment.date).toLocaleDateString("es-ES")}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-4">
        <Link to={`/goals/${goal._id}/edit`}>
          <Button type="button" variant="primary" size="md">
            Editar Meta
          </Button>
        </Link>

        <Button
          type="button"
          variant="danger"
          size="md"
          onClick={handleDeleteGoal}
        >
          Eliminar Meta
        </Button>

        <Link to="/goals">
          <Button type="button" variant="secondary" size="md">
            Volver a la Lista
          </Button>
        </Link>
      </div>
    </section>
  );
}
