import apiClient from "../config/axios";
import type { INotification, ISuccessResponse } from "../interfaces";
import { API_BASE_URL } from "../config/env";

export const notificationApiService = {
  getNotifications: async (
    cursor?: string,
    limit = 15,
  ): Promise<ISuccessResponse<INotification[]>> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", String(limit));

    const queryString = params.toString();
    const response = await apiClient.get<ISuccessResponse<INotification[]>>(
      `${API_BASE_URL}/api/notifications?${queryString}`,
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<
      ISuccessResponse<{ count: number }>
    >(`${API_BASE_URL}/api/notifications/unread-count`);
    return response.data.data?.count ?? 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`${API_BASE_URL}/api/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch(`${API_BASE_URL}/api/notifications/read-all`);
  },
};
