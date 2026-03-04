import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpError } from "./useHttpError";
import { offlineStorage } from "../utils/offlineStorage";
import type { ISuccessResponse } from "../interfaces";

// ── useFetchByIdOffline ─────────────────────────────────────────────

export interface UseFetchByIdOfflineOptions<T> {
  fetchFn: (id: string) => Promise<T | null>;
  cacheKey: string;
  id?: string;
  autoFetch?: boolean;
}

export function useFetchByIdOffline<T>({
  fetchFn,
  cacheKey,
  id: providedId,
  autoFetch = true,
}: UseFetchByIdOfflineOptions<T>) {
  const { id: urlId } = useParams<{ id: string }>();
  const id = providedId || urlId || "";
  const fullKey = `${cacheKey}_${id}`;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    if (!id) {
      handleError(new Error("Falta el ID"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      clearError();
      setIsOffline(false);
      const result = await fetchFn(id);
      setData(result);
      if (result) offlineStorage.save(fullKey, result);
    } catch (err) {
      const cached = offlineStorage.load<T>(fullKey);
      if (cached) {
        setData(cached);
        setIsOffline(true);
      } else {
        handleError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [id]);

  return { data, loading, errorMessage, isOffline, refetch: fetchData, clearError };
}

// ── useFetchListOffline ─────────────────────────────────────────────

export interface UseFetchListOfflineOptions<T, F = void> {
  fetchFn: (filters?: F) => Promise<ISuccessResponse<T[]>>;
  cacheKey: string;
  filters?: F;
  autoFetch?: boolean;
  dependencies?: unknown[];
}

export function useFetchListOffline<T, F = void>({
  fetchFn,
  cacheKey,
  filters,
  autoFetch = true,
  dependencies = [],
}: UseFetchListOfflineOptions<T, F>) {
  const [response, setResponse] = useState<ISuccessResponse<T[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      setIsOffline(false);
      const result = await fetchFn(filters);
      setResponse(result);
      if (result?.data) {
        offlineStorage.save(cacheKey, result);
      }
    } catch (err) {
      const cached = offlineStorage.load<ISuccessResponse<T[]>>(cacheKey);
      if (cached) {
        setResponse(cached);
        setIsOffline(true);
      } else {
        handleError(err);
        setResponse(null);
      }
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
    response,
    loading,
    errorMessage,
    isOffline,
    refetch: fetchData,
    clearError,
    isEmpty: (response?.data?.length ?? 0) === 0 && !loading,
  };
}

// ── useFetchDataOffline ─────────────────────────────────────────────

export interface UseFetchDataOfflineOptions<T> {
  fetchFn: () => Promise<T>;
  cacheKey: string;
  autoFetch?: boolean;
  dependencies?: unknown[];
}

export function useFetchDataOffline<T>({
  fetchFn,
  cacheKey,
  autoFetch = true,
  dependencies = [],
}: UseFetchDataOfflineOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { errorMessage, handleError, clearError } = useHttpError();

  const fetchData = async () => {
    try {
      setLoading(true);
      clearError();
      setIsOffline(false);
      const result = await fetchFn();
      setData(result);
      if (result) offlineStorage.save(cacheKey, result);
    } catch (err) {
      const cached = offlineStorage.load<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsOffline(true);
      } else {
        handleError(err);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, ...dependencies]);

  return { data, loading, errorMessage, isOffline, refetch: fetchData, clearError };
}
