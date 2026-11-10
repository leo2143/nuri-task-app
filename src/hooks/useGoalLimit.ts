import { useFetchData } from "./useFetch";
import { goalService } from "../services/goalService";

interface UseGoalLimitOptions {
  enabled?: boolean;
}

/**
 * Cupo de metas del usuario según el servidor.
 * Si la consulta falla NO bloquea: `limitReached` queda en false y el 403 del
 * servidor al crear sigue siendo la red de seguridad.
 */
export function useGoalLimit({ enabled = true }: UseGoalLimitOptions = {}) {
  const { data, loading, errorMessage } = useFetchData({
    fetchFn: goalService.getGoalQuota,
    autoFetch: enabled,
  });

  return {
    quota: data,
    loading: enabled && loading,
    error: errorMessage,
    limitReached: data?.canCreate === false,
  };
}
