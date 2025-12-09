import { nuriAlegreOjos } from "../assets/ilustrations";

interface EmptyStateProps {
  itemName: string; // "Usuarios", "Tareas", "Metas", etc.
}

export default function EmptyState({ itemName }: EmptyStateProps) {
  return (
    <div className="relative h-80 overflow-hidden text-center py-12 bg-neutral bg-opacity-10 rounded-lg shadow-brand-glow">
      <span>
        <strong className="text-2xl w-full font-heading">
          Todavía no hay {itemName}
        </strong>
      </span>
      <p className="text-tertiary font font-heading">
        <strong className="text-2xl text-primary">
          ¡Es el momento perfecto para empezar!
        </strong>
      </p>
      <img
        className="absolute w-52 top-48 left-1/2 -translate-x-1/2"
        src={nuriAlegreOjos}
        alt="Nuri alegre"
      />
    </div>
  );
}
