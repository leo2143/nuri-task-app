import { useToastActions, useToastState } from "../../hooks";
import NuriToast from "./NuriToast";

export default function ToastHost() {
  const { current, version } = useToastState();
  const { dismiss, startExit } = useToastActions();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-5 pt-safe-top"
    >
      <div className="mt-2 w-full max-w-[353px]">
        {current && (
          <div className="pointer-events-auto">
            <NuriToast
              key={current.id}
              toast={current}
              version={version}
              onExitStart={startExit}
              onDismiss={dismiss}
            />
          </div>
        )}
      </div>
    </div>
  );
}
