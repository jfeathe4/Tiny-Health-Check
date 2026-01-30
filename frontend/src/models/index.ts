/**
 * Enum for the status of a registered URL.
 */
export enum UrlStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  PENDING = 'pending',
}

/**
 * Interface representing a registered URL and its health status.
 */
export interface RegisteredUrl {
  id: string;
  link: string;
  status: UrlStatus;
  responseTime?: number; // in milliseconds
  lastChecked?: Date;
}

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  status: string;
  results: number;
  data: T;
}
