import { useState, useEffect, useCallback, useRef } from "react";
import type { ISuccessResponse, FilterValues } from "../interfaces";
import { useFetchList } from "./useFetch";

export interface PaginationOptions {
  enabled: boolean;
  limit: number;
}

export interface UseFilterableListOptions<T, F> {
  fetchFn: (filters?: F) => Promise<ISuccessResponse<T[]>>;
  buildFilters: (
    searchTerm: string,
    pagination?: { limit: number; cursor?: string },
    activeFilters?: FilterValues
  ) => F | undefined;
  debounceMs?: number;
  pagination?: PaginationOptions;
  extraDependencies?: unknown[];
}

export interface UseFilterableListResult<T> {
  data: T[];
  loading: boolean;
  errorMessage: string;
  isEmpty: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFirstLoad: boolean;
  activeFilters: FilterValues;
  setActiveFilters: (values: FilterValues) => void;
  // Pagination
  loadMore: () => Promise<void>;
  loadingMore: boolean;
  hasMore: boolean;
}

export function useFilterableList<T, F>({
  fetchFn,
  buildFilters,
  debounceMs = 500,
  pagination,
  extraDependencies = [],
}: UseFilterableListOptions<T, F>): UseFilterableListResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  // Pagination state
  const [accumulatedData, setAccumulatedData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const isLoadingMoreRef = useRef(false);
  const activeFiltersRef = useRef(activeFilters);
  activeFiltersRef.current = activeFilters;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filters = pagination?.enabled
    ? buildFilters(debouncedSearch, { limit: pagination.limit }, activeFilters)
    : buildFilters(debouncedSearch, undefined, activeFilters);

  const { response, loading, errorMessage } = useFetchList<T, F>({
    fetchFn,
    filters,
    dependencies: [debouncedSearch, activeFilters, ...extraDependencies],
  });

  // Sincroniza datos cuando llega la respuesta (carga inicial o cambio de búsqueda)
  useEffect(() => {
    if (isLoadingMoreRef.current) return;

    if (response?.data) {
      setAccumulatedData(response.data);

      if (pagination?.enabled) {
        setNextCursor(response.meta?.nextCursor || null);
        setHasMore(response.meta?.hasMore || false);
      }
    } else if (!loading) {
      setAccumulatedData([]);
      setNextCursor(null);
      setHasMore(false);
    }
  }, [response, pagination?.enabled, loading]);

  useEffect(() => {
    if (!loading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [loading, isFirstLoad]);

  const loadMore = useCallback(async () => {
    if (!pagination?.enabled || !nextCursor || loadingMore) return;

    try {
      // Activar ref ANTES de todo (evita que useEffect sobrescriba)
      isLoadingMoreRef.current = true;
      setLoadingMore(true);

      const moreFilters = buildFilters(
        debouncedSearch,
        { limit: pagination.limit, cursor: nextCursor },
        activeFiltersRef.current
      );
      const newResponse = await fetchFn(moreFilters);

      if (newResponse?.data) {
        // Append: agregar nuevos datos a los existentes
        setAccumulatedData((prev) => [...prev, ...newResponse.data!]);
        setNextCursor(newResponse.meta?.nextCursor || null);
        setHasMore(newResponse.meta?.hasMore || false);
      }
    } catch (err) {
      console.error("Error al cargar más datos:", err);
    } finally {
      setLoadingMore(false);
      // Desactivar ref DESPUÉS de todo
      isLoadingMoreRef.current = false;
    }
  }, [pagination, nextCursor, loadingMore, debouncedSearch, buildFilters, fetchFn]);

  // Use accumulated data if pagination is enabled, otherwise use response data
  const data = pagination?.enabled ? accumulatedData : (response?.data || []);

  return {
    data,
    loading,
    errorMessage,
    isEmpty: data.length === 0 && !loading,
    searchTerm,
    setSearchTerm,
    isFirstLoad,
    activeFilters,
    setActiveFilters,
    loadMore,
    loadingMore,
    hasMore,
  };
}
