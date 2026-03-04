import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

export default class LazyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunkError =
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Loading CSS chunk");

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LazyErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, isChunkError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="font-heading text-xl font-bold text-tertiary">
          {this.state.isChunkError
            ? "Sin conexión"
            : "Algo salió mal"}
        </h2>
        <p className="max-w-md font-body text-sm text-gray-700">
          {this.state.isChunkError
            ? "No se pudo cargar esta página porque no hay conexión a internet. Conectate y volvé a intentar."
            : "Ocurrió un error inesperado al cargar esta página."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={this.handleRetry}
            className="rounded-lg bg-primary px-5 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Reintentar
          </button>
          <button
            onClick={this.handleReload}
            className="rounded-lg border border-gray-300 px-5 py-2 font-body text-sm text-tertiary transition-colors hover:bg-gray-100"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
}
