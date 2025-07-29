export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar: string;
  userAuth?: UserAuth;
  userConfig?: UserConfig;
}

export interface UserAuth {
  uuid: string;
  role: RoleType;
  isActive: boolean;
}

export interface UserConfig {
  uuid: string;
  notification: boolean;
  language: string;
  currency: string;
}

export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ROOT = 'ROOT',
}

export interface Bill {
  uuid: string;
  accountBill: string;
  amountMoney: number;
  currency: Currency;
  user: User;
}

export interface Currency {
  uuid: string;
  name: string;
  currentExchangeRate: number;
  base: boolean;
}

export interface Transaction {
  uuid: string;
  amountMoney: number;
  transferTitle: string;
  authorizationStatus: boolean;
  senderBill: Bill;
  recipientBill: Bill;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ReduxAction<T = unknown> {
  type: string;
  payload?: T;
}

export interface ReduxState {
  app: AppState;
  dashboardPage: DashboardPageState;
  paymentPage: PaymentPageState;
  historyPage: HistoryPageState;
  settingsPage: SettingsPageState;
  loginPage: LoginPageState;
  registerPage: RegisterPageState;
  resetPasswordPage: ResetPasswordPageState;
  forgetPasswordPage: ForgetPasswordPageState;
  languageProvider: LanguageProviderState;
  loadingProvider: LoadingProviderState;
  errorProvider: ErrorProviderState;
}

export interface AppState {
  user: User | null;
  isCollapsedSidebar: boolean;
  isCollapsedDrawer: boolean;
  currentStep: number;
  layout: GridLayout;
}

export interface DashboardPageState {
  isOpenedModal: boolean;
}

export interface PaymentPageState {
  currentStep: number;
  recipient: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface HistoryPageState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface SettingsPageState {
  isLoading: boolean;
  error: string | null;
}

export interface LoginPageState {
  isLoading: boolean;
  error: string | null;
}

export interface RegisterPageState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

export interface ResetPasswordPageState {
  isLoading: boolean;
  error: string | null;
}

export interface ForgetPasswordPageState {
  isLoading: boolean;
  error: string | null;
}

export interface LanguageProviderState {
  locale: string;
}

export interface LoadingProviderState {
  isLoading: boolean;
}

export interface ErrorProviderState {
  error: string | null;
}

export interface GridLayout {
  lg: GridLayoutItem[];
  md: GridLayoutItem[];
  sm: GridLayoutItem[];
  xs: GridLayoutItem[];
  xxs: GridLayoutItem[];
}

export interface GridLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormProps extends ComponentProps {
  onSubmit?: (values: unknown) => void;
  initialValues?: Record<string, unknown>;
  loading?: boolean;
}

export interface ModalProps extends ComponentProps {
  visible: boolean;
  onCancel: () => void;
  onOk?: () => void;
  title?: string;
  width?: number;
}

export interface TableColumn<T = unknown> {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: unknown, record: T) => React.ReactNode;
  sorter?: boolean;
  width?: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface PaymentFormData {
  senderBill: string;
  recipientBill: string;
  amountMoney: number;
  transferTitle: string;
  locale: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currency: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  pinCode?: string;
}
