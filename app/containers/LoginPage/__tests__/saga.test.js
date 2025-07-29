import { runSaga } from 'redux-saga';
import { push } from 'connected-react-router';
import { request, api, routes } from 'utils';
import { login } from '../saga';
import { loginSuccessAction, loginErrorAction } from '../actions';

jest.mock('utils', () => ({
  request: jest.fn(),
  api: {
    auth: {
      login: 'http://localhost:4000/bank/Auth/login',
    },
  },
  routes: {
    dashboard: {
      path: '/dashboard',
    },
  },
}));

describe('LoginPage Saga', () => {
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

  describe('login saga', () => {
    it('should handle successful login', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      const mockToken = { accessToken: 'test-token' };
      const mockPinCode = '1234';
      const mockPassword = 'password123';

      request.mockResolvedValue({ user: mockUser, token: mockToken });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            loginPage: {
              pinCode: mockPinCode,
              password: mockPassword,
            },
          }),
        },
        login,
      ).toPromise();

      expect(request).toHaveBeenCalledWith(api.auth.login, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinCode: mockPinCode,
          password: mockPassword,
        }),
      });
      expect(dispatched).toContainEqual(
        loginSuccessAction(mockUser, mockToken),
      );
      expect(dispatched).toContainEqual(push(routes.dashboard.path));
    });

    it('should handle login error with 404 status (account not found)', async () => {
      const mockError = { statusCode: 404 };
      const mockPinCode = '1234';
      const mockPassword = 'password123';

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            loginPage: {
              pinCode: mockPinCode,
              password: mockPassword,
            },
          }),
        },
        login,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(loginErrorAction().type);
      expect(dispatched[0].error).toBeDefined();
    });

    it('should handle login error with 403 status (invalid password)', async () => {
      const mockError = { statusCode: 403 };
      const mockPinCode = '1234';
      const mockPassword = 'wrongpassword';

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            loginPage: {
              pinCode: mockPinCode,
              password: mockPassword,
            },
          }),
        },
        login,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(loginErrorAction().type);
      expect(dispatched[0].error).toBeDefined();
    });

    it('should handle login error with default status (server error)', async () => {
      const mockError = { statusCode: 500 };
      const mockPinCode = '1234';
      const mockPassword = 'password123';

      request.mockRejectedValue(mockError);

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            loginPage: {
              pinCode: mockPinCode,
              password: mockPassword,
            },
          }),
        },
        login,
      ).toPromise();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0].type).toBe(loginErrorAction().type);
      expect(dispatched[0].error).toBeDefined();
    });

    it('should handle login with empty credentials', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      const mockToken = { accessToken: 'test-token' };
      const mockPinCode = '';
      const mockPassword = '';

      request.mockResolvedValue({ user: mockUser, token: mockToken });

      await runSaga(
        {
          ...mockStore,
          getState: () => ({
            loginPage: {
              pinCode: mockPinCode,
              password: mockPassword,
            },
          }),
        },
        login,
      ).toPromise();

      expect(request).toHaveBeenCalledWith(api.auth.login, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pinCode: '', password: '' }),
      });
      expect(dispatched).toContainEqual(
        loginSuccessAction(mockUser, mockToken),
      );
      expect(dispatched).toContainEqual(push(routes.dashboard.path));
    });
  });
});
