import { apiClient } from '../utils/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TransactionRequest,
  BillRequest,
  UserUpdateRequest,
  TransactionHistoryParams,
  BillListParams,
  PaginatedApiResponse,
} from '../interfaces/api';
import { User, Transaction, Bill, Currency } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.removeAuthToken();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });

    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('accessToken', response.data.accessToken);

    return response.data;
  }
}

export class UserService {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  }

  async updateProfile(userData: UserUpdateRequest): Promise<User> {
    const response = await apiClient.put<User>('/users/update', userData);
    return response.data;
  }

  async getUserBills(): Promise<Bill[]> {
    const response = await apiClient.get<Bill[]>('/users/bills');
    return response.data;
  }
}

export class TransactionService {
  async createTransaction(transactionData: TransactionRequest): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions', transactionData);
    return response.data;
  }

  async getTransactionHistory(params?: TransactionHistoryParams): Promise<PaginatedApiResponse<Transaction>> {
    const response = await apiClient.get<Transaction[]>('/transactions/history', params);
    return response as PaginatedApiResponse<Transaction>;
  }

  async getTransactionDetails(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  }
}

export class BillService {
  async getBills(params?: BillListParams): Promise<PaginatedApiResponse<Bill>> {
    const response = await apiClient.get<Bill[]>('/bills', params);
    return response as PaginatedApiResponse<Bill>;
  }

  async createBill(billData: BillRequest): Promise<Bill> {
    const response = await apiClient.post<Bill>('/bills', billData);
    return response.data;
  }

  async updateBill(id: string, billData: Partial<BillRequest>): Promise<Bill> {
    const response = await apiClient.put<Bill>(`/bills/${id}`, billData);
    return response.data;
  }

  async deleteBill(id: string): Promise<void> {
    await apiClient.delete(`/bills/${id}`);
  }
}

export class CurrencyService {
  async getCurrencies(): Promise<Currency[]> {
    const response = await apiClient.get<Currency[]>('/currencies');
    return response.data;
  }

  async getExchangeRates(): Promise<Record<string, number>> {
    const response = await apiClient.get<Record<string, number>>('/currencies/rates');
    return response.data;
  }
}

export const authService = new AuthService();
export const userService = new UserService();
export const transactionService = new TransactionService();
export const billService = new BillService();
export const currencyService = new CurrencyService();
