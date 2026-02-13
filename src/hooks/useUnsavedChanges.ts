import { useState, useCallback, useMemo } from "react";
import { useBlocker } from "react-router-dom";
import { cloudinaryService } from "../services/cloudinaryService";

interface UseUnsavedChangesOptions {
  initialValues: Record<string, unknown>;
  currentValues: Record<string, unknown>;
  pendingImageUrl?: string;
  enabled?: boolean;
}

interface UseUnsavedChangesReturn {
  hasChanges: boolean;
  isBlocked: boolean;
  handleConfirmNavigation: () => Promise<void>;
  handleCancelNavigation: () => void;
  markAsSaved: () => void;
}

function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (obj1 === undefined || obj2 === undefined) return obj1 === obj2;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== "object") return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) =>
    deepEqual(
      (obj1 as Record<string, unknown>)[key],
      (obj2 as Record<string, unknown>)[key]
    )
  );
}

export function useUnsavedChanges({
  initialValues,
  currentValues,
  pendingImageUrl,
  enabled = true,
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
  const [isSaved, setIsSaved] = useState(false);

  const hasChanges = useMemo(() => {
    if (isSaved) return false;
    return !deepEqual(initialValues, currentValues);
  }, [initialValues, currentValues, isSaved]);

  const shouldBlock = enabled && hasChanges && !isSaved;

  const blocker = useBlocker(shouldBlock);

  const isBlocked = blocker.state === "blocked";

  const handleConfirmNavigation = useCallback(async () => {
    if (pendingImageUrl) {
      try {
        await cloudinaryService.deleteImage(pendingImageUrl);
      } catch (error) {
        console.error("Error deleting orphan image:", error);
      }
    }
    blocker.proceed?.();
  }, [pendingImageUrl, blocker]);

  const handleCancelNavigation = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  const markAsSaved = useCallback(() => {
    setIsSaved(true);
  }, []);

  return {
    hasChanges,
    isBlocked,
    handleConfirmNavigation,
    handleCancelNavigation,
    markAsSaved,
  };
}

