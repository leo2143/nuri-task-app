import { alert } from "../assets/svg-icons";

export default function Alert({ msg }: { msg: string }) {
  return (
    <div
      className="bg-secondary border-2 text-white px-4 py-3 rounded-lg flex items-start gap-3"
      role="alert"
      aria-live="assertive"
    >
      <img
        src={alert}
        alt=""
        aria-hidden="true"
        className="w-5 h-5 mt-0.5 flex-shrink-0"
      />
      <p className="font-body text-sm font-medium">{msg}</p>
    </div>
  );
}
