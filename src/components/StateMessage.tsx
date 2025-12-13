import { nuriTriste, nuriAlegreOjos, nuriError } from "../assets/ilustrations";

type StateVariant = "notFound" | "error" | "notFoundList";

interface StateMessageProps {
  itemName: string;
  variant: StateVariant;
}

const variantConfig = {
  notFound: {
    title: (itemName: string) => `No se encontró el ${itemName}`,
    message: "Por favor, verifica el ID o intenta nuevamente.",
    image: nuriTriste,
  },
  error: {
    title: (itemName: string) => `Lo siento, no pude cargar ${itemName}`,
    message: "Por favor, espera unos segundos y vuelve a intentarlo.",
    image: nuriError,
  },
  notFoundList: {
    title: (itemName: string) => `Todavía no hay ${itemName}`,
    message: "¡Es el momento perfecto para empezar!",
    image: nuriAlegreOjos,
  },
};

export default function StateMessage({ itemName, variant }: StateMessageProps) {
  const config = variantConfig[variant];

  return (
    <div className="relative h-80 overflow-hidden text-center py-12 bg-neutral bg-opacity-10 rounded-lg shadow-brand-glow">
      <span>
        <strong className="text-2xl w-full font-heading">
          {config.title(itemName)}
        </strong>
      </span>
      <p className="text-tertiary font font-heading">
        <strong className="text-2xl text-primary">{config.message}</strong>
      </p>
      <img
        className="absolute w-52 top-48 left-1/2 -translate-x-1/2"
        src={config.image}
        alt="Nuri"
      />
    </div>
  );
}
