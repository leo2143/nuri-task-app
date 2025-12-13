import { useState, useEffect } from "react";
import { useFetchList } from "./useFetch";

export interface UseFilterableListOptions<T, F> {
  fetchFn: (filters?: F) => Promise<T[]>;
  buildFilters: (searchTerm: string) => F | undefined;
  debounceMs?: number;
}

export interface UseFilterableListResult<T> {
  data: T[];
  loading: boolean;
  errorMessage: string;
  isEmpty: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFirstLoad: boolean;
}

export function useFilterableList<T, F>({
  fetchFn,
  buildFilters,
  debounceMs = 500,
}: UseFilterableListOptions<T, F>): UseFilterableListResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const { data, loading, errorMessage, isEmpty } = useFetchList<T, F>({
    fetchFn,
    filters: buildFilters(debouncedSearch),
    dependencies: [debouncedSearch],
  });

  useEffect(() => {
    if (!loading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [loading, isFirstLoad]);

  return {
    data,
    loading,
    errorMessage,
    isEmpty,
    searchTerm,
    setSearchTerm,
    isFirstLoad,
  };
}
