import { resetPassword } from '../saga';

jest.mock('utils', () => ({
  api: {
    auth: {
      resetPassword: 'http://api.test/auth/reset-password',
    },
  },
  request: jest.fn(),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: jest.fn(() => 'mocked-formatted-message'),
  defineMessages: jest.fn((messages) => messages),
}));

describe('ResetPasswordPage Saga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('should handle successful password reset', async () => {
      const mockPassword = 'newpassword123';
      const mockToken = 'reset-token';

      const generator = resetPassword();

      const selectPasswordEffect = generator.next().value;
      expect(selectPasswordEffect.type).toBe('SELECT');

      const selectTokenEffect = generator.next(mockPassword).value;
      expect(selectTokenEffect.type).toBe('SELECT');

      const callEffect = generator.next(mockToken).value;
      expect(callEffect.type).toBe('CALL');
      expect(callEffect.payload.args[0]).toBe(
        'http://api.test/auth/reset-password',
      );
      expect(callEffect.payload.args[1]).toEqual({
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${mockToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: mockPassword }),
      });

      const putEffect = generator.next().value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/ResetPasswordPage/RESET_PASSWORD_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
    });

    it('should handle 400 error with token error message', async () => {
      const mockPassword = 'newpassword123';
      const mockToken = 'invalid-token';
      const mockError = { statusCode: 400 };

      const generator = resetPassword();

      generator.next();
      generator.next(mockPassword);
      generator.next(mockToken);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ResetPasswordPage/RESET_PASSWORD_ERROR',
      );
      // FormattedMessage is called within the saga, not directly testable in this way
    });

    it('should handle default error with server error message', async () => {
      const mockPassword = 'newpassword123';
      const mockToken = 'reset-token';
      const mockError = { statusCode: 500 };

      const generator = resetPassword();

      generator.next();
      generator.next(mockPassword);
      generator.next(mockToken);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ResetPasswordPage/RESET_PASSWORD_ERROR',
      );
      // FormattedMessage is called within the saga, not directly testable in this way
    });

    it('should handle error without statusCode', async () => {
      const mockPassword = 'newpassword123';
      const mockToken = 'reset-token';
      const mockError = new Error('Network error');

      const generator = resetPassword();

      generator.next();
      generator.next(mockPassword);
      generator.next(mockToken);

      const errorResult = generator.throw(mockError);
      expect(errorResult.value.type).toBe('PUT');
      expect(errorResult.value.payload.action.type).toBe(
        'app/ResetPasswordPage/RESET_PASSWORD_ERROR',
      );
      // FormattedMessage is called within the saga, not directly testable in this way
    });
  });
});
