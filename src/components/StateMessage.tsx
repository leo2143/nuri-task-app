import { nuriTriste, nuriAlegreOjos, nuriError } from "../assets/ilustrations";

type StateVariant = "notFound" | "error" | "notFoundList" | "offline";

interface StateMessageProps {
  itemName: string;
  variant: StateVariant;
}

const variantConfig = {
  notFound: {
    title: (itemName: string) => `No encontramos ${itemName}`,
    message: "Revisá el enlace o volvé a intentar.",
    image: nuriTriste,
  },
  error: {
    title: (itemName: string) => `No pudimos cargar ${itemName}`,
    message: "Esperá unos segundos y volvé a intentarlo.",
    image: nuriError,
  },
  notFoundList: {
    title: (itemName: string) => `Todavía no hay ${itemName}`,
    message: "¡Es el momento perfecto para empezar!",
    image: nuriAlegreOjos,
  },
  offline: {
    title: () => "Sin conexión",
    message: "No podemos cargar esta página sin internet. Conectate y volvé a intentar.",
    image: null,
  },
};

export default function StateMessage({ itemName, variant }: StateMessageProps) {
  const config = variantConfig[variant];

  return (
    <div className={`relative overflow-hidden text-center py-12 bg-neutral bg-opacity-10 rounded-lg shadow-brand-glow ${config.image ? "h-80" : ""}`}>
      <span>
        <strong className="text-2xl w-full font-heading">
          {config.title(itemName)}
        </strong>
      </span>
      <p className="text-tertiary font font-heading">
        <strong className="text-2xl text-primary">{config.message}</strong>
      </p>
      {config.image && (
        <img
          className="absolute w-52 top-48 left-1/2 -translate-x-1/2"
          src={config.image}
          alt="Nuri"
        />
      )}
    </div>
  );
}
