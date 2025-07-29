import { forgotPasswordAction } from '../actions';
import { FORGOT_PASSWORD_REQUEST } from '../constants';

describe('ForgetPasswordPage actions', () => {
  describe('Forgot Password Action', () => {
    it('has a type of FORGOT_PASSWORD_REQUEST', () => {
      const expected = {
        type: FORGOT_PASSWORD_REQUEST,
      };
      expect(forgotPasswordAction()).toEqual(expected);
    });
  });
});
