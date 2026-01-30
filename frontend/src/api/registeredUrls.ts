import { apiClient } from './client';
import { RegisteredUrl, ApiResponse } from '../models';

export const getRegisteredUrls = async () => {
  const response = await apiClient.get<ApiResponse<RegisteredUrl[]>>('/url');
  return response.data.data;
};

export const createRegisteredUrl = async (url: string) => {
  const response = await apiClient.post<ApiResponse<RegisteredUrl>>('/url', { url });
  return response.data.data;
};