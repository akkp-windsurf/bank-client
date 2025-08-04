export interface User {
  id?: string;
  email?: string;
  name?: string;
  userConfig?: {
    notificationCount?: number;
    messageCount?: number;
  };
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  exchangeRate?: number;
}

export interface Message {
  uuid: string;
  subject: string;
  body: string;
  readed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface AppState {
  isCollapsedSidebar: boolean;
  isCollapsedDrawer: boolean;
  isLogged: boolean;
  token: any;
  user: User;
  currencies: Currency[];
  messages: {
    data: Message[];
    count?: number;
  };
  notifications: Notification[];
  isOpenedMessage: boolean;
  isOpenedModal: boolean;
  openedMessage: string;
  layout?: any;
}

export interface RootState {
  global: AppState;
  language: any;
  loading: any;
  error: any;
  router: any;
  [key: string]: any;
}
