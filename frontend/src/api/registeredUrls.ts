import { apiClient } from './client';
import { RegisteredUrl } from '../models';

export const getRegisteredUrls = async () => {
  const response = await apiClient.get<RegisteredUrl>('/url');
  return response.data;
};

export const createRegisteredUrl = async (url: string) => {
  const response = await apiClient.post<RegisteredUrl>('/url', { url });
  return response.data;
};