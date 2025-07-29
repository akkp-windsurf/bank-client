import { runSaga } from 'redux-saga';
import { register } from '../saga';
import { registerSuccessAction, registerErrorAction } from '../actions';

describe('RegisterPage Saga', () => {
  let dispatched = [];

  beforeEach(() => {
    dispatched = [];
    jest.clearAllMocks();
  });

  const mockStore = {
    dispatch: (action) => dispatched.push(action),
    getState: () => ({
      registerPage: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        currency: 'USD',
      },
    }),
  };

  describe('register', () => {
    it('should handle user registration success', async () => {
      const mockResponse = {
        userAuth: { pinCode: '1234' },
      };
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockResolvedValue(mockResponse);

      await runSaga(mockStore, register).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: registerSuccessAction().type,
        }),
      );

      mockRequest.mockRestore();
    });

    it('should handle user registration error', async () => {
      const mockError = new Error('Email already exists');
      mockError.statusCode = 409;
      const mockRequest = jest
        .spyOn(jest.requireActual('utils/request'), 'default')
        .mockRejectedValue(mockError);

      await runSaga(mockStore, register).toPromise();

      expect(dispatched).toContainEqual(
        expect.objectContaining({
          type: registerErrorAction().type,
        }),
      );

      mockRequest.mockRestore();
    });
  });
});
