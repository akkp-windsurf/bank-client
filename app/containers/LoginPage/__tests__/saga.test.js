import { runSaga } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import watchLogin, { login as loginSaga } from '../saga';
import { loginSuccessAction, loginErrorAction } from '../actions';
import request from '../../../utils/request';

describe('LoginPage Saga', () => {
  describe('loginSaga', () => {
    it('should login user successfully', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: {
          id: 'user-uuid',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        token: {
          accessToken: 'jwt-token',
          expiresIn: '3600',
        },
      };

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      const mockRequest = jest.fn().mockResolvedValue(mockResponse);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(loginSuccessAction(mockResponse));
    });

    it('should handle login error', async () => {
      const mockCredentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      const mockRequest = jest.fn().mockRejectedValue(error);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(loginErrorAction(error.message));
    });

    it('should make correct API call', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = jest.fn().mockResolvedValue({});

      const saga = runSaga(
        {
          dispatch: () => {},
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(mockRequest).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(mockCredentials),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('watchLogin', () => {
    it('should watch for LOGIN action', () => {
      const generator = watchLogin();
      const expected = takeEvery('LOGIN', loginSaga);

      expect(generator.next().value).toEqual(expected);
    });
  });

  describe('Saga Effects', () => {
    it('should use correct saga effects', () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const generator = loginSaga({ credentials: mockCredentials });

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(
        call(request, '/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(mockCredentials),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      const mockResponse = { user: { id: 'user-uuid' }, token: {} };
      const putEffect = generator.next(mockResponse).value;
      expect(putEffect).toEqual(put(loginSuccessAction(mockResponse)));
    });

    it('should handle saga errors correctly', () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const generator = loginSaga({ credentials: mockCredentials });

      generator.next();

      const error = new Error('Login failed');
      const putEffect = generator.throw(error).value;

      expect(putEffect).toEqual(put(loginErrorAction(error.message)));
    });
  });

  describe('Token Handling', () => {
    it('should store token in localStorage on successful login', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: { id: 'user-uuid' },
        token: {
          accessToken: 'jwt-token',
          expiresIn: '3600',
        },
      };

      const localStorageMock = {
        setItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });

      const saga = runSaga(
        {
          dispatch: () => {},
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      const mockRequest = jest.fn().mockResolvedValue(mockResponse);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        mockResponse.token.accessToken,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const authError = new Error('Unauthorized');
      authError.status = 401;

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      const mockRequest = jest.fn().mockRejectedValue(authError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(loginErrorAction('Unauthorized'));
    });

    it('should handle server errors', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const serverError = new Error('Internal Server Error');
      serverError.status = 500;

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loginSaga,
        { credentials: mockCredentials },
      );

      const mockRequest = jest.fn().mockRejectedValue(serverError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        loginErrorAction('Internal Server Error'),
      );
    });
  });
});
