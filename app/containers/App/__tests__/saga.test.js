import { runSaga } from 'redux-saga';
import {
  logout,
  getCurrencies,
  checkEmail,
  getMessages,
  readAllMessages,
  getNotifications,
} from '../saga';
import {
  logoutSuccessAction,
  logoutErrorAction,
  getCurrenciesSuccessAction,
  getCurrenciesErrorAction,
  checkEmailSuccessAction,
  checkEmailInvalidAction,
  checkEmailErrorAction,
  getMessagesSuccessAction,
  getMessagesErrorAction,
  readAllMessagesSuccessAction,
  readAllMessagesErrorAction,
  getNotificationsSuccessAction,
  getNotificationsErrorAction,
} from '../actions';

describe('App Saga', () => {
  let dispatched = [];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  const mockStore = {
    dispatch: (action) => dispatched.push(action),
    getState: () => ({
      global: {
        token: { accessToken: 'test-token' },
      },
    }),
  };

  describe('logout', () => {
    it('should handle logout success', async () => {
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue({});

      await runSaga(mockStore, logout).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: logoutSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle logout error', async () => {
      const mockError = new Error('Logout failed');
      mockError.statusCode = 401;
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      await runSaga(mockStore, logout).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: logoutErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });

  describe('getCurrencies', () => {
    it('should handle getCurrencies success', async () => {
      const mockData = [{ code: 'USD', name: 'US Dollar' }];
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue({ data: mockData });

      await runSaga(mockStore, getCurrencies).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getCurrenciesSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle getCurrencies error', async () => {
      const mockError = new Error('Failed to fetch currencies');
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      await runSaga(mockStore, getCurrencies).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getCurrenciesErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });

  describe('checkEmail', () => {
    it('should handle valid email check with existing email', async () => {
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue({ exist: true });
      const mockResolve = jest.fn();
      const mockReject = jest.fn();

      const action = {
        value: 'test@example.com',
        resolve: mockResolve,
        reject: mockReject,
      };

      await runSaga(mockStore, checkEmail, action).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: checkEmailSuccessAction().type,
        }),
      );
      expect(mockReject).toHaveBeenCalled();

      mockRequest.mockRestore();
    });

    it('should handle valid email check with non-existing email', async () => {
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue({ exist: false });
      const mockResolve = jest.fn();
      const mockReject = jest.fn();

      const action = {
        value: 'new@example.com',
        resolve: mockResolve,
        reject: mockReject,
      };

      await runSaga(mockStore, checkEmail, action).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: checkEmailSuccessAction().type,
        }),
      );
      expect(mockResolve).toHaveBeenCalled();

      mockRequest.mockRestore();
    });

    it('should handle empty email value', async () => {
      const mockResolve = jest.fn();
      const mockReject = jest.fn();

      const action = {
        value: '',
        resolve: mockResolve,
        reject: mockReject,
      };

      await runSaga(mockStore, checkEmail, action).toPromise();

      expect(mockResolve).toHaveBeenCalled();
    });

    it('should handle invalid email format', async () => {
      const mockResolve = jest.fn();
      const mockReject = jest.fn();

      const action = {
        value: 'invalid-email',
        resolve: mockResolve,
        reject: mockReject,
      };

      await runSaga(mockStore, checkEmail, action).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: checkEmailInvalidAction().type,
        }),
      );
      expect(mockResolve).toHaveBeenCalled();
    });

    it('should handle checkEmail error', async () => {
      const mockError = new Error('Network error');
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);
      const mockResolve = jest.fn();
      const mockReject = jest.fn();

      const action = {
        value: 'test@example.com',
        resolve: mockResolve,
        reject: mockReject,
      };

      await runSaga(mockStore, checkEmail, action).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: checkEmailErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });

  describe('getMessages', () => {
    it('should handle getMessages success', async () => {
      const mockResponse = { data: [{ id: 1, message: 'Test message' }] };
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue(mockResponse);

      await runSaga(mockStore, getMessages).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getMessagesSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle getMessages error', async () => {
      const mockError = new Error('Failed to fetch messages');
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      await runSaga(mockStore, getMessages).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getMessagesErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });

  describe('readAllMessages', () => {
    it('should handle readAllMessages success', async () => {
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue({});

      await runSaga(mockStore, readAllMessages).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: readAllMessagesSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle readAllMessages error', async () => {
      const mockError = new Error('Failed to mark messages as read');
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      await runSaga(mockStore, readAllMessages).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: readAllMessagesErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });

  describe('getNotifications', () => {
    it('should handle getNotifications success', async () => {
      const mockResponse = {
        data: [{ id: 1, notification: 'Test notification' }],
      };
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue(mockResponse);

      const mockStoreWithUser = {
        ...mockStore,
        getState: () => ({
          global: {
            token: { accessToken: 'test-token' },
            user: { userConfig: { notificationCount: 10 } },
          },
        }),
      };

      await runSaga(mockStoreWithUser, getNotifications).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getNotificationsSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle getNotifications error', async () => {
      const mockError = new Error('Failed to fetch notifications');
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      const mockStoreWithUser = {
        ...mockStore,
        getState: () => ({
          global: {
            token: { accessToken: 'test-token' },
            user: { userConfig: { notificationCount: 10 } },
          },
        }),
      };

      await runSaga(mockStoreWithUser, getNotifications).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: getNotificationsErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });
});
