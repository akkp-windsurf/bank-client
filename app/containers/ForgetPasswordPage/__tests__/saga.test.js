import { forgotPassword } from '../saga';

jest.mock('utils', () => ({
  api: {
    auth: {
      forgetPassword: 'http://api.test/auth/forgot-password',
    },
  },
  request: jest.fn(),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: jest.fn(() => 'mocked-formatted-message'),
  defineMessages: jest.fn((messages) => messages),
}));

describe('ForgetPasswordPage Saga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('should handle successful password reset request', async () => {
      const mockEmail = 'test@example.com';
      const mockLocale = 'en';

      const generator = forgotPassword();

      const selectEmailEffect = generator.next().value;
      expect(selectEmailEffect.type).toBe('SELECT');

      const selectLocaleEffect = generator.next(mockEmail).value;
      expect(selectLocaleEffect.type).toBe('SELECT');

      const callEffect = generator.next(mockLocale).value;
      expect(callEffect.type).toBe('CALL');
      expect(callEffect.payload.args[0]).toBe(
        'http://api.test/auth/forgot-password',
      );
      expect(callEffect.payload.args[1]).toEqual({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: mockEmail, locale: mockLocale }),
      });

      const putEffect = generator.next().value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/ForgetPasswordPage/FORGOT_PASSWORD_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
    });

    it('should handle 400 error with not found message', async () => {
      const mockEmail = 'test@example.com';
      const mockLocale = 'en';
      const mockError = { statusCode: 400 };

      const generator = forgotPassword();

      generator.next();
      generator.next(mockEmail);
      generator.next(mockLocale);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ForgetPasswordPage/FORGOT_PASSWORD_ERROR',
      );
    });

    it('should handle default error with server error message', async () => {
      const mockEmail = 'test@example.com';
      const mockLocale = 'en';
      const mockError = { statusCode: 500 };

      const generator = forgotPassword();

      generator.next();
      generator.next(mockEmail);
      generator.next(mockLocale);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ForgetPasswordPage/FORGOT_PASSWORD_ERROR',
      );
    });

    it('should handle error without statusCode', async () => {
      const mockEmail = 'test@example.com';
      const mockLocale = 'en';
      const mockError = new Error('Network error');

      const generator = forgotPassword();

      generator.next();
      generator.next(mockEmail);
      generator.next(mockLocale);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ForgetPasswordPage/FORGOT_PASSWORD_ERROR',
      );
    });
  });
});
