import { runSaga } from 'redux-saga';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import { api, request } from 'utils';
import { numberValidation } from '../../../helpers';
import {
  getBillsSuccessAction,
  getBillsErrorAction,
  searchRecipientSuccessAction,
  searchRecipientErrorAction,
  checkRecipientCorrectAction,
  checkRecipientIncorrectAction,
  createTransactionSuccessAction,
  getAuthorizationKeySuccessAction,
  confirmTransactionSuccessAction,
  confirmTransactionIncorrectAction,
} from '../actions';
import {
  getBills,
  searchRecipient,
  checkRecipient,
  createTransaction,
  getAuthorizationKey,
  confirmTransaction,
} from '../saga';

jest.mock('utils', () => ({
  api: {
    bills: jest.fn(() => 'mock-bills-url'),
    transactions: jest.fn((type) => {
      if (type === 'create') return 'mock-create-transaction-url';
      if (type === 'confirm') return 'mock-confirm-transaction-url';
      if (type === 'authorizationKey')
        return jest.fn(() => 'mock-auth-key-url');
      return 'mock-transaction-url';
    }),
  },
  request: jest.fn(),
  routes: {
    login: { path: '/login' },
    dashboard: { path: '/dashboard' },
  },
}));

jest.mock('antd', () => ({
  notification: {
    success: jest.fn(),
  },
}));

jest.mock('../../../helpers', () => ({
  numberValidation: jest.fn(),
}));

describe('PaymentPage Saga', () => {
  let dispatched = [];
  let mockStore;

  beforeEach(() => {
    dispatched = [];
    mockStore = {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    };
    jest.clearAllMocks();
  });

  describe('getBills saga', () => {
    it('should handle successful bills fetch', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockBills = [{ id: 1, number: '123456' }];

      request.mockResolvedValue({ data: mockBills });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
          }),
        },
        getBills,
      ).toPromise();

      expect(request).toHaveBeenCalledWith('mock-bills-url', {
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' },
      });
      expect(dispatched).toContainEqual(getBillsSuccessAction(mockBills));
    });

    it('should handle bills fetch error with 401 status', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = { statusCode: 401 };

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
          }),
        },
        getBills,
      ).toPromise();

      expect(dispatched).toContainEqual(getBillsErrorAction(mockError));
      expect(dispatched).toContainEqual(push('/login'));
    });

    it('should handle bills fetch error with default status', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = { statusCode: 500 };

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
          }),
        },
        getBills,
      ).toPromise();

      expect(dispatched).toContainEqual(getBillsErrorAction(mockError));
      expect(dispatched).toContainEqual(push('/login'));
    });
  });

  describe('searchRecipient saga', () => {
    it('should handle successful recipient search', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockRecipients = [{ id: 1, name: 'John Doe' }];
      const action = { value: '123456789' };

      numberValidation.mockReturnValue(true);
      api.bills.mockReturnValue(() => 'mock-search-url');
      request.mockResolvedValue({ data: mockRecipients });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
          }),
        },
        searchRecipient,
        action,
      ).toPromise();

      expect(numberValidation).toHaveBeenCalledWith('123456789');
      expect(dispatched).toContainEqual(
        searchRecipientSuccessAction(mockRecipients),
      );
    });

    it('should return early if number validation fails', async () => {
      const action = { value: 'invalid' };

      numberValidation.mockReturnValue(false);

      await runSaga(mockStore, searchRecipient, action).toPromise();

      expect(request).not.toHaveBeenCalled();
      expect(dispatched).toHaveLength(0);
    });

    it('should handle search error with 401 status', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = { statusCode: 401 };
      const action = { value: '123456789' };

      numberValidation.mockReturnValue(true);
      api.bills.mockReturnValue(() => 'mock-search-url');
      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
          }),
        },
        searchRecipient,
        action,
      ).toPromise();

      expect(dispatched).toContainEqual(searchRecipientErrorAction(mockError));
      expect(dispatched).toContainEqual(push('/login'));
    });
  });

  describe('checkRecipient saga', () => {
    it('should dispatch correct action when recipient exists', async () => {
      const mockRecipients = [
        { uuid: 'recipient-123' },
        { uuid: 'recipient-456' },
      ];
      const mockRecipientBill = { uuid: 'recipient-123' };

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            paymentPage: {
              recipients: mockRecipients,
              recipientBill: mockRecipientBill,
            },
          }),
        },
        checkRecipient,
      ).toPromise();

      expect(dispatched).toContainEqual(checkRecipientCorrectAction());
    });

    it('should dispatch incorrect action when recipient does not exist', async () => {
      const mockRecipients = [{ uuid: 'recipient-456' }];
      const mockRecipientBill = { uuid: 'recipient-123' };

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            paymentPage: {
              recipients: mockRecipients,
              recipientBill: mockRecipientBill,
            },
          }),
        },
        checkRecipient,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(checkRecipientIncorrectAction().type);
    });
  });

  describe('createTransaction saga', () => {
    it('should handle successful transaction creation', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockLocale = 'en';
      const mockUuid = 'transaction-123';

      request.mockResolvedValue({ uuid: mockUuid });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
            language: { locale: mockLocale },
            paymentPage: {
              senderBill: { uuid: 'sender-123' },
              recipientBill: { uuid: 'recipient-123' },
              amountMoney: 100,
              transferTitle: 'Test Transfer',
            },
          }),
        },
        createTransaction,
      ).toPromise();

      expect(request).toHaveBeenCalledWith('mock-create-transaction-url', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({
          amountMoney: 100,
          transferTitle: 'Test Transfer',
          senderBill: 'sender-123',
          recipientBill: 'recipient-123',
          locale: 'en',
        }),
      });
      expect(dispatched).toContainEqual(
        createTransactionSuccessAction(mockUuid),
      );
    });

    it('should handle transaction creation error silently', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = new Error('Transaction failed');

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
            language: { locale: 'en' },
            paymentPage: {
              senderBill: { uuid: 'sender-123' },
              recipientBill: { uuid: 'recipient-123' },
              amountMoney: 100,
              transferTitle: 'Test Transfer',
            },
          }),
        },
        createTransaction,
      ).toPromise();

      expect(dispatched).toHaveLength(0);
    });
  });

  describe('getAuthorizationKey saga', () => {
    it('should handle successful authorization key fetch', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockTransaction = 'transaction-123';
      const mockAuthKey = 'auth-key-456';

      request.mockResolvedValue({ authorizationKey: mockAuthKey });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
            paymentPage: { transaction: mockTransaction },
          }),
        },
        getAuthorizationKey,
      ).toPromise();

      expect(dispatched).toContainEqual(
        getAuthorizationKeySuccessAction(mockAuthKey),
      );
    });

    it('should handle authorization key fetch error silently', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = new Error('Auth key failed');

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: { token: mockToken },
            paymentPage: { transaction: 'transaction-123' },
          }),
        },
        getAuthorizationKey,
      ).toPromise();

      expect(dispatched).toHaveLength(0);
    });
  });

  describe('confirmTransaction saga', () => {
    it('should handle successful transaction confirmation', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockAuthKey = 'auth-key-123';
      const mockSnippets = {
        success: {
          title: 'Success',
          description: 'Transaction confirmed',
        },
      };
      const action = { snippets: mockSnippets };

      request.mockResolvedValue({});

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: {
              token: mockToken,
              isCollapsedSidebar: false,
            },
            paymentPage: { authorizationKey: mockAuthKey },
          }),
        },
        confirmTransaction,
        action,
      ).toPromise();

      expect(request).toHaveBeenCalledWith('mock-confirm-transaction-url', {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({ authorizationKey: mockAuthKey }),
      });
      expect(dispatched).toContainEqual(confirmTransactionSuccessAction());
      expect(dispatched).toContainEqual(push('/dashboard'));
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Success',
        description: 'Transaction confirmed',
        style: { width: 400, marginLeft: 250 },
        placement: 'bottomLeft',
      });
    });

    it('should handle transaction confirmation error with 404 status', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = { statusCode: 404 };
      const action = { snippets: {} };

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: {
              token: mockToken,
              isCollapsedSidebar: true,
            },
            paymentPage: { authorizationKey: 'auth-key-123' },
          }),
        },
        confirmTransaction,
        action,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(confirmTransactionIncorrectAction().type);
    });

    it('should handle transaction confirmation error with default status', async () => {
      const mockToken = { accessToken: 'test-token' };
      const mockError = { statusCode: 500 };
      const action = { snippets: {} };

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            global: {
              token: mockToken,
              isCollapsedSidebar: false,
            },
            paymentPage: { authorizationKey: 'auth-key-123' },
          }),
        },
        confirmTransaction,
        action,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(confirmTransactionIncorrectAction().type);
    });
  });
});
