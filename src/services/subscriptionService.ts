import apiClient from "../config/axios";
import type { ISuccessResponse } from "../interfaces";
import { API_BASE_URL } from "../config/env";

interface ISubscriptionData {
  subscription: {
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
  };
}

export const subscriptionService = {
  activate: async (): Promise<ISubscriptionData> => {
    const response = await apiClient.post<ISuccessResponse<ISubscriptionData>>(
      `${API_BASE_URL}/api/subscription/activate`
    );
    return response.data.data!;
  },

  cancel: async (): Promise<ISubscriptionData> => {
    const response = await apiClient.post<ISuccessResponse<ISubscriptionData>>(
      `${API_BASE_URL}/api/subscription/cancel`
    );
    return response.data.data!;
  },

  getStatus: async (): Promise<ISubscriptionData> => {
    const response = await apiClient.get<ISuccessResponse<ISubscriptionData>>(
      `${API_BASE_URL}/api/subscription/status`
    );
    return response.data.data!;
  },
};
