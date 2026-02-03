import type { ReactNode } from "react";
import { InputFilter } from "./ui";
import Loading from "./Loading";
import StateMessage from "./StateMessage";
import LoadMoreButton from "./LoadMoreButton";

interface FilterableListProps<T> {
  data: T[];
  loading: boolean;
  errorMessage: string;
  isEmpty: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  renderItem: (item: T) => ReactNode;
  emptyStateName: string;
  isFirstLoad: boolean;
  extraFilters?: ReactNode;
  // Pagination props
  loadMore?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
  loadMoreText?: string;
  loadingMoreText?: string;
}

export default function FilterableList<T extends { _id?: string }>({
  data,
  loading,
  errorMessage,
  isEmpty,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  renderItem,
  emptyStateName,
  isFirstLoad,
  extraFilters,
  loadMore,
  loadingMore = false,
  hasMore = false,
  loadMoreText = "Cargar más",
  loadingMoreText = "Cargando más...",
}: FilterableListProps<T>) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  if (loading && isFirstLoad) {
    return <Loading />;
  }

  return (
    <>
      <InputFilter
        id="filter"
        name="filtro"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={searchPlaceholder}
        disabled={loading}
      />

      {extraFilters}

      {!errorMessage ? (
        <div className="flex flex-col gap-4">
          {searchTerm && (
            <div className="flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-tertiary/70">Buscando...</p>
                </>
              ) : (
                <p className="text-sm text-tertiary/70">
                  Mostrando {data.length} resultado
                  {data.length !== 1 ? "s" : ""} para "{searchTerm}"
                </p>
              )}
            </div>
          )}

          <div
            className={`flex flex-col gap-4 transition-opacity duration-200 ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {isEmpty ? (
              <StateMessage itemName={emptyStateName} variant="notFoundList" />
            ) : (
              <>
                {data.map((item: T) => renderItem(item))}

                {loadMore && (
                  <LoadMoreButton
                    isLoading={loadingMore}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    buttonText={loadMoreText}
                    loadingMessage={loadingMoreText}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <StateMessage itemName={emptyStateName} variant="error" />
      )}
    </>
  );
}
