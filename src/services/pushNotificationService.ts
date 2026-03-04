import apiClient from "../config/axios";
import { API_BASE_URL, VAPID_PUBLIC_KEY } from "../config/env";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushNotificationService = {
  isPushSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) return "denied";
    return Notification.requestPermission();
  },

  async getExistingSubscription(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  },

  async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      const permission = await this.requestPermission();
      if (permission !== "granted") return null;

      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      await this.sendSubscriptionToServer(subscription);
      return subscription;
    } catch (error) {
      console.error("Error suscribiendo a push:", error);
      return null;
    }
  },

  async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    const subscriptionJSON = subscription.toJSON();
    await apiClient.post(`${API_BASE_URL}/api/push/subscribe`, {
      endpoint: subscriptionJSON.endpoint,
      keys: subscriptionJSON.keys,
    });
  },

  async unsubscribe(): Promise<boolean> {
    try {
      const subscription = await this.getExistingSubscription();
      if (!subscription) return true;

      await apiClient.delete(`${API_BASE_URL}/api/push/unsubscribe`, {
        data: { endpoint: subscription.endpoint },
      });

      await subscription.unsubscribe();
      return true;
    } catch (error) {
      console.error("Error desuscribiendo de push:", error);
      return false;
    }
  },
};
