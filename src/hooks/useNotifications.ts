import { useState, useEffect, useCallback } from "react";
import { pushNotificationService } from "../services/pushNotificationService";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "denied",
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSupported = pushNotificationService.isPushSupported();

  useEffect(() => {
    if (!isSupported || !isAuthenticated) return;

    pushNotificationService.getExistingSubscription().then((sub) => {
      setIsSubscribed(!!sub);
    });
  }, [isSupported, isAuthenticated]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return false;
    setIsLoading(true);
    try {
      const subscription = await pushNotificationService.subscribeToPush();
      const success = !!subscription;
      setIsSubscribed(success);
      setPermission(Notification.permission);
      return success;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) setIsSubscribed(false);
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
