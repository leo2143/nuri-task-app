import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpError } from "./useHttpError";

// Hook para traer un recurso por ID (lee el ID de la URL automáticamente)
export interface UseFetchByIdOptions<T> {
  fetchFn: (id: string) => Promise<T | null>;
  id?: string;
  autoFetch?: boolean;
}

export interface UseFetchByIdResult<T> {
  data: T | null;
  loading: boolean;
  errorMessage: string;
  refetch: () => Promise<void>;
  clearError: () => void;
}

// Hook para traer listas con filtros opcionales
export interface UseFetchListOptions<T, F = void> {
  fetchFn: (filters?: F) => Promise<T[]>;
  filters?: F;
  autoFetch?: boolean;
  dependencies?: unknown[];
}

export interface UseFetchListResult<T> {
  data: T[];
  loading: boolean;
  errorMessage: string;
  refetch: () => Promise<void>;
  clearError: () => void;
  isEmpty: boolean;
}
// Trae un solo elemento por ID (ej: una tarea, una meta)
export function useFetchById<T>({
  fetchFn,
  id: providedId,
  autoFetch = true,
}: UseFetchByIdOptions<T>): UseFetchByIdResult<T> {
  const { id: urlId } = useParams<{ id: string }>();
  const id = providedId || urlId || "";

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    if (!id) {
      handleError(new Error("Che, falta el ID"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      clearError();
      const result = await fetchFn(id);
      setData(result);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [id]);

  return {
    data,
    loading,
    errorMessage,
    refetch: fetchData,
    clearError,
  };
}

// Trae una lista de elementos (ej: todas las tareas, todas las metas)
export function useFetchList<T, F = void>({
  fetchFn,
  filters,
  autoFetch = true,
  dependencies = [],
}: UseFetchListOptions<T, F>): UseFetchListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      const result = await fetchFn(filters);
      setData(result);
    } catch (err) {
      handleError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]);

  return {
    data,
    loading,
    errorMessage,
    refetch: fetchData,
    clearError,
    isEmpty: data.length === 0 && !loading,
  };
}

// Hook para traer un solo objeto de datos (no requiere ID)
export interface UseFetchDataOptions<T> {
  fetchFn: () => Promise<T>;
  autoFetch?: boolean;
  dependencies?: unknown[];
}

export interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  errorMessage: string;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useFetchData<T>({
  fetchFn,
  autoFetch = true,
  dependencies = [],
}: UseFetchDataOptions<T>): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      handleError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]);

  return {
    data,
    loading,
    errorMessage,
    refetch: fetchData,
    clearError,
  };
}
