import { runSaga } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import watchRegister, { register as registerSaga } from '../saga';
import { registerSuccessAction, registerErrorAction } from '../actions';
import request from '../../../utils/request';

describe('RegisterPage Saga', () => {
  describe('registerSaga', () => {
    it('should register user successfully', async () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const mockResponse = {
        user: {
          id: 'user-uuid',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      };

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        registerSaga,
        { userData: mockUserData },
      );

      const mockRequest = jest.fn().mockResolvedValue(mockResponse);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        registerSuccessAction(mockResponse.user),
      );
    });

    it('should handle registration error', async () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const error = new Error('Email already exists');

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        registerSaga,
        { userData: mockUserData },
      );

      const mockRequest = jest.fn().mockRejectedValue(error);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(registerErrorAction(error.message));
    });

    it('should make correct API call', async () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const mockRequest = jest.fn().mockResolvedValue({});

      const saga = runSaga(
        {
          dispatch: () => {},
          getState: () => ({}),
        },
        registerSaga,
        { userData: mockUserData },
      );

      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(mockRequest).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(mockUserData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('watchRegister', () => {
    it('should watch for REGISTER action', () => {
      const generator = watchRegister();
      const expected = takeEvery('REGISTER', registerSaga);

      expect(generator.next().value).toEqual(expected);
    });
  });

  describe('Saga Effects', () => {
    it('should use correct saga effects', () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const generator = registerSaga({ userData: mockUserData });

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(
        call(request, '/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(mockUserData),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      const mockResponse = { user: { id: 'user-uuid' } };
      const putEffect = generator.next(mockResponse).value;
      expect(putEffect).toEqual(put(registerSuccessAction(mockResponse.user)));
    });

    it('should handle saga errors correctly', () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const generator = registerSaga({ userData: mockUserData });

      generator.next();

      const error = new Error('Registration failed');
      const putEffect = generator.throw(error).value;

      expect(putEffect).toEqual(put(registerErrorAction(error.message)));
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const mockUserData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123',
        currency: '',
      };

      const validationError = new Error('Validation failed');
      validationError.status = 400;

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        registerSaga,
        { userData: mockUserData },
      );

      const mockRequest = jest.fn().mockRejectedValue(validationError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        registerErrorAction('Validation failed'),
      );
    });

    it('should handle network errors', async () => {
      const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      };

      const networkError = new Error('Network Error');
      networkError.name = 'NetworkError';

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        registerSaga,
        { userData: mockUserData },
      );

      const mockRequest = jest.fn().mockRejectedValue(networkError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(registerErrorAction('Network Error'));
    });
  });
});
