import { ButtonLink } from "../components/ui";

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-heading font-bold text-tertiary mb-4">
          Bienvenido a Nuri Task App
        </h2>
        <p className="text-xl font-body text-tertiary">
          Gestiona tus tareas de manera eficiente y mantente organizado
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-6 mt-12">
        <article className="bg-white p-6 rounded-lg shadow-md border border-neutral hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-2xl font-heading font-semibold text-tertiary mb-3">
            Crear Tareas
          </h3>
          <p className="font-body text-tertiary mb-4">
            Crea y organiza fácilmente tus tareas diarias con nuestra interfaz
            intuitiva.
          </p>
          <ButtonLink to="/tasks" variant="primary" size="sm">
            Ver Tareas
          </ButtonLink>
        </article>

        <article className="bg-white p-6 rounded-lg shadow-md border border-neutral hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-2xl font-heading font-semibold text-tertiary mb-3">
            Seguimiento de Progreso
          </h3>
          <p className="font-body text-tertiary mb-4">
            Monitorea tu progreso y mantente al tanto de tus objetivos con un
            seguimiento detallado.
          </p>
          <ButtonLink to="/goals" variant="secondary" size="sm">
            Comenzar
          </ButtonLink>
        </article>
      </section>

      <section className="mt-12 bg-primary bg-opacity-20 p-6 rounded-lg border border-secondary">
        <h3 className="text-2xl font-heading font-semibold text-tertiary mb-4">
          Características Actuales
        </h3>
        <ul className="space-y-3 font-body text-tertiary">
          <li className="flex items-start">
            <span className="mr-2 text-primary font-bold text-xl">✓</span>
            <span>
              <strong className="text-tertiary">
                Autenticación de usuarios
              </strong>{" "}
              - Registro e inicio de sesión seguro con JWT
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary font-bold text-xl">✓</span>
            <span>
              <strong className="text-tertiary">
                Gestión completa de tareas
              </strong>{" "}
              - Crea, edita, elimina y marca tareas como completadas
            </span>
          </li>

          <li className="flex items-start">
            <span className="mr-2 text-primary font-bold text-xl">✓</span>
            <span>
              <strong className="text-tertiary">Metas y objetivos SMART</strong>{" "}
              - Define y alcanza tus metas con objetivos específicos, medibles y
              alcanzables
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary font-bold text-xl">✓</span>
            <span>
              <strong className="text-tertiary">Interfaz responsiva</strong> -
              Diseño adaptable que funciona para telefonos, tablets y desktop
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-secondary font-bold text-xl">⏳</span>
            <span>
              <strong className="text-tertiary/70">
                Logros y métricas de progreso
              </strong>{" "}
              <em className="text-tertiary/60">- Próximamente</em>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-secondary font-bold text-xl">⏳</span>
            <span>
              <strong className="text-tertiary/70">
                Notificaciones y recordatorios
              </strong>{" "}
              <em className="text-tertiary/60">- Próximamente</em>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-secondary font-bold text-xl">⏳</span>
            <span>
              <strong className="text-tertiary/70">Perfil de usuario</strong>{" "}
              <em className="text-tertiary/60">- Próximamente</em>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-secondary font-bold text-xl">⏳</span>
            <span>
              <strong className="text-tertiary/70">
                Tablero de visualización (Moodboard)
              </strong>{" "}
              <em className="text-tertiary/60">- Próximamente</em>
            </span>
          </li>
        </ul>
      </section>
    </section>
  );
}
