import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function TaskList() {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Completar configuración de React Router', completed: true },
    { id: '2', title: 'Crear componentes de tareas', completed: false },
    { id: '3', title: 'Agregar animaciones GSAP', completed: false },
    { id: '4', title: 'Estilos con Tailwind CSS', completed: false },
  ]);

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-contrast mb-2">
          Mis Tareas
        </h1>
        <p className="font-body text-depth">
          Gestiona tus tareas diarias y mantente productivo
        </p>
      </header>

      <section className="mb-6">
        <button 
          type="button"
          className="px-6 py-3 bg-primary text-base font-body font-medium rounded-lg hover:bg-balance focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Agregar Nueva Tarea
        </button>
      </section>

      <section>
        <h2 className="text-xl font-heading font-semibold text-contrast mb-4">
          Lista de Tareas
        </h2>
        
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="bg-white p-4 rounded-lg shadow border border-neutral-light hover:shadow-md hover:border-warmth transition-all duration-200"
              >
                <article className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      readOnly
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                      aria-label={`Marcar tarea "${task.title}" como ${task.completed ? 'incompleta' : 'completa'}`}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={`text-lg font-body cursor-pointer ${task.completed ? 'line-through text-neutral-dark' : 'text-contrast'}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  
                  <Link 
                    to={`/tasks/${task.id}`}
                    className="px-4 py-2 text-sm font-body text-primary hover:text-balance hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded transition-colors duration-200"
                  >
                    Ver Detalles
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-warmth bg-opacity-10 rounded-lg border border-warmth">
            <p className="font-body text-depth text-lg">
              <em>No hay tareas aún. ¡Crea tu primera tarea para comenzar!</em>
            </p>
          </div>
        )}
      </section>
    </article>
  );
}

