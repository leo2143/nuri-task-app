import { Button } from "./ui";
import LoadingMore from "./LoadingMore";

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMessage?: string;
  buttonText?: string;
}

export default function LoadMoreButton({
  isLoading,
  hasMore,
  onLoadMore,
  loadingMessage = "Cargando más...",
  buttonText = "Cargar más",
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="mt-6 flex justify-center">
      {isLoading ? (
        <LoadingMore message={loadingMessage} />
      ) : (
        <Button type="button" variant="secondary" size="md" onClick={onLoadMore}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}

