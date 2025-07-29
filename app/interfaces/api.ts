import { User, Bill, Transaction, Currency } from '../types';

export interface ApiEndpoints {
  auth: {
    login: '/auth/login';
    register: '/auth/register';
    logout: '/auth/logout';
    refresh: '/auth/refresh';
  };
  users: {
    profile: '/users/profile';
    update: '/users/update';
    bills: '/users/bills';
  };
  transactions: {
    create: '/transactions';
    history: '/transactions/history';
    details: (id: string) => `/transactions/${id}`;
  };
  bills: {
    list: '/bills';
    create: '/bills';
    update: (id: string) => `/bills/${id}`;
    delete: (id: string) => `/bills/${id}`;
  };
  currencies: {
    list: '/currencies';
    rates: '/currencies/rates';
  };
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  pinCode?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currency: string;
}

export interface TransactionRequest {
  senderBill: string;
  recipientBill: string;
  amountMoney: number;
  transferTitle: string;
}

export interface BillRequest {
  accountBill: string;
  amountMoney: number;
  currencyUuid: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  notification?: boolean;
  language?: string;
  currency?: string;
}

export interface TransactionHistoryParams {
  page?: number;
  take?: number;
  startDate?: string;
  endDate?: string;
  type?: 'sent' | 'received' | 'all';
}

export interface BillListParams {
  page?: number;
  take?: number;
  currency?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}
