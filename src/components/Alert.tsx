export default function Alert({ msg }: { msg: string }) {
  return (
    <div
      className="bg-secondary border-2 text-white px-4 py-3 rounded-lg flex items-start gap-3"
      role="alert"
      aria-live="assertive"
    >
      <svg
        className="w-5 h-5 mt-0.5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <p className="font-body text-sm font-medium">{msg}</p>
    </div>
  );
}
