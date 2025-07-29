import { ApiRequestConfig, ApiResponse, ApiError } from '../interfaces/api';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${config.url}`;
    const headers = { ...this.defaultHeaders, ...config.headers };

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Request failed', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0);
    }
  }

  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params as Record<string, string>) : '';
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;
    
    return this.request<T>({
      method: 'GET',
      url: fullUrl,
    });
  }

  async post<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  async put<T = unknown>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_URL || 'http://localhost:3001');
