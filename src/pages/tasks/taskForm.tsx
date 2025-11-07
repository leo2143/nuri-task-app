import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "../../components/ui/Button";
import type { ICreateTodo, ITodo, TodoPriority } from "../../interfaces";
import { useHttpError } from "../../hooks";
import { todoservice } from "../../services/todoService";
import { Input } from "../../components/ui";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [task, setTask] = useState<ITodo | null>(null);
  const isEditMode = !!id; // true si estamos editando

  // Textos dinámicos según el modo
  const pageTitle = isEditMode ? "Editar Tarea" : "Crear Nueva Tarea";
  const pageDescription = isEditMode
    ? "Modifica los campos que desees actualizar"
    : "Completa los campos para agregar una nueva tarea";
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Crear Tarea";
  const loadingButtonText = isEditMode ? "Guardando..." : "Creando...";

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  // Estados de validación
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await todoservice.getTodoById(id!);

        // Poblar el formulario con los datos de la tarea
        if (data) {
          setTask(data);
          setTitle(data.title);
          setDescription(data.description || "");
          setPriority(data.priority);

          // Formatear fecha para input type="date"
          if (data.dueDate) {
            const date = new Date(data.dueDate);
            const formattedDate = date.toISOString().split("T")[0];
            setDueDate(formattedDate);
          }
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Validación del título
  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitleError("El título es requerido");
    } else {
      setTitleError("");
    }
  };

  // Manejador del submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    // Validación
    if (!title.trim()) {
      setTitleError("El título es requerido");
      return;
    }

    try {
      setLoading(true);

      const taskData: ICreateTodo = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };

      if (isEditMode) {
        // ACTUALIZAR tarea existente
        await todoservice.updateTodo(id!, taskData);
        setSuccessMessage("¡Tarea actualizada exitosamente!");
      } else {
        // CREAR nueva tarea
        await todoservice.createTodo(taskData);
        setSuccessMessage("¡Tarea creada exitosamente!");

        // Limpiar formulario solo en modo crear
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
      }

      // Redirigir a la lista de tareas después de 1.5 segundos
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial cuando se carga la tarea en modo edición
  if (loading && isEditMode && !task) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="font-body text-tertiary">Cargando tarea...</p>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h1>
        <p className="font-body text-tertiary">{pageDescription}</p>
      </header>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-body text-green-600">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Título */}
        <Input
          type="text"
          id="title"
          name="title"
          label="Título de la Tarea"
          placeholder="Ej: Completar informe mensual"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
          disabled={loading}
          error={titleError}
          helperText="Campo obligatorio"
        />

        {/* Descripción */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-tertiary"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder="Describe los detalles de la tarea (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-tertiary"
          >
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TodoPriority)}
            disabled={loading}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        {/* Fecha límite */}
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          label="Fecha Límite"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
          helperText="Opcional: selecciona una fecha de vencimiento"
        />

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="flex-1"
          >
            {loading ? loadingButtonText : submitButtonText}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={loading}
            onClick={() => navigate("/tasks")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </article>
  );
}
