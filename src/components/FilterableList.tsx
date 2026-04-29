import { useState } from "react";
import type { ReactNode } from "react";
import type { FilterConfig, FilterValues } from "../interfaces";
import { InputFilter, Spinner, FilterBottomSheet } from "./ui";
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
  filterConfig?: FilterConfig[];
  activeFilters?: FilterValues;
  onFiltersChange?: (values: FilterValues) => void;
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
  filterConfig,
  activeFilters = {},
  onFiltersChange,
  loadMore,
  loadingMore = false,
  hasMore = false,
  loadMoreText = "Cargar más",
  loadingMoreText = "Cargando más...",
}: FilterableListProps<T>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

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
        onFilterPress={filterConfig ? () => setIsFilterOpen(true) : undefined}
        activeFilterCount={activeFilterCount}
      />

      {filterConfig && onFiltersChange && (
        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filterConfig}
          activeFilters={activeFilters}
          onApply={onFiltersChange}
        />
      )}

      {extraFilters}

      <div className="flex flex-col gap-2">
        {(searchTerm || activeFilterCount > 0) && (
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <Spinner size="sm" />
                <p className="text-sm text-tertiary/70">Buscando...</p>
              </>
            ) : data.length > 0 ? (
              <p className="text-sm text-tertiary/70">
                Mostrando {data.length} resultado
                {data.length !== 1 ? "s" : ""}
                {searchTerm ? ` para "${searchTerm}"` : ""}
                {activeFilterCount > 0
                  ? ` con ${activeFilterCount} filtro${activeFilterCount !== 1 ? "s" : ""}`
                  : ""}
              </p>
            ) : null}
          </div>
        )}

        {errorMessage && !isEmpty ? (
          <StateMessage itemName={emptyStateName} variant="error" />
        ) : (
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
        )}
      </div>
    </>
  );
}
