import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import StateMessage from "./StateMessage";

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
      <article className="flex flex-col items-center justify-center h-screen gap-6">
        <StateMessage
          itemName="esta página"
          variant={this.state.isChunkError ? "offline" : "error"}
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={this.handleRetry}
            className="inline-block px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Reintentar
          </button>
          <button
            onClick={this.handleReload}
            className="inline-block px-6 py-3 border-2 border-secondary text-secondary font-body font-medium rounded-lg hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors duration-200"
          >
            Recargar página
          </button>
        </div>
      </article>
    );
  }
}
