import NuriTaskIcon from "../assets/ilustrations/nuri-task-icon.svg";
import NenufarIcon from "../assets/icons/nenufar-whit-border.svg";
import FlorIcon from "../assets/icons/flor.svg";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 bg-neutral z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="relative w-80 h-80 flex items-center justify-center">
        <img
          src={NuriTaskIcon}
          alt="Nuri Task"
          className="w-24 h-auto z-10"
        />

        <div className="absolute inset-0 animate-spin-slow">
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 top-[15%] left-[20%]"
          />
          <img
            src={FlorIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-8 h-8 top-[10%] left-1/2 -translate-x-1/2"
          />
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 top-[15%] right-[20%]"
          />
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 top-[42%] left-[5%]"
          />
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 top-[42%] right-[5%]"
          />
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 bottom-[15%] left-[20%]"
          />
          <img
            src={FlorIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-8 h-8 bottom-[10%] left-1/2 -translate-x-1/2"
          />
          <img
            src={NenufarIcon}
            alt=""
            aria-hidden="true"
            className="absolute w-12 h-12 bottom-[15%] right-[20%]"
          />
        </div>
      </div>
    </div>
  );
}
