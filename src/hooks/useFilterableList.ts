import { useState, useEffect, useCallback, useRef } from "react";
import type { ISuccessResponse } from "../interfaces";
import { useFetchList } from "./useFetch";

export interface PaginationOptions {
  enabled: boolean;
  limit: number;
}

export interface UseFilterableListOptions<T, F> {
  fetchFn: (filters?: F) => Promise<ISuccessResponse<T[]>>;
  buildFilters: (searchTerm: string, pagination?: { limit: number; cursor?: string }) => F | undefined;
  debounceMs?: number;
  pagination?: PaginationOptions;
}

export interface UseFilterableListResult<T> {
  data: T[];
  loading: boolean;
  errorMessage: string;
  isEmpty: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFirstLoad: boolean;
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
}: UseFilterableListOptions<T, F>): UseFilterableListResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Pagination state
  const [accumulatedData, setAccumulatedData] = useState<T[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filters = pagination?.enabled
    ? buildFilters(debouncedSearch, { limit: pagination.limit })
    : buildFilters(debouncedSearch);

  const { response, loading, errorMessage } = useFetchList<T, F>({
    fetchFn,
    filters,
    dependencies: [debouncedSearch],
  });

  // Sincroniza datos cuando llega la respuesta (carga inicial o cambio de búsqueda)
  useEffect(() => {
    // Si estamos en medio de "cargar más", NO tocar los datos
    if (isLoadingMoreRef.current) return;

    if (response?.data) {
      setAccumulatedData(response.data);

      // Actualizar estado de paginación
      if (pagination?.enabled) {
        setNextCursor(response.meta?.nextCursor || null);
        setHasMore(response.meta?.hasMore || false);
      }
    }
  }, [response, pagination?.enabled]);

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

      const moreFilters = buildFilters(debouncedSearch, {
        limit: pagination.limit,
        cursor: nextCursor,
      });
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
    loadMore,
    loadingMore,
    hasMore,
  };
}
