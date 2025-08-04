export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    userConfig: {
      notificationCount: number;
      messageCount: number;
    };
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface CurrencyResponse {
  data: Array<{
    id: string;
    name: string;
    code: string;
    exchangeRate: number;
  }>;
}

export interface MessagesResponse {
  data: Array<{
    uuid: string;
    subject: string;
    body: string;
    readed: boolean;
    createdAt: string;
  }>;
  count: number;
}

export interface NotificationsResponse {
  data: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
  }>;
}

export interface CheckEmailResponse {
  exist: boolean;
}

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}
