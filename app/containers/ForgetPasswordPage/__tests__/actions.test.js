import {
  forgotPasswordAction,
  forgotPasswordSuccessAction,
  forgotPasswordErrorAction,
} from '../actions';
import {
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
} from '../constants';

describe('ForgetPasswordPage actions', () => {
  describe('forgotPasswordAction', () => {
    it('should create FORGOT_PASSWORD_REQUEST action', () => {
      const expectedAction = {
        type: FORGOT_PASSWORD_REQUEST,
      };
      expect(forgotPasswordAction()).toEqual(expectedAction);
    });
  });

  describe('forgotPasswordSuccessAction', () => {
    it('should create FORGOT_PASSWORD_SUCCESS action', () => {
      const expectedAction = {
        type: FORGOT_PASSWORD_SUCCESS,
      };
      expect(forgotPasswordSuccessAction()).toEqual(expectedAction);
    });
  });

  describe('forgotPasswordErrorAction', () => {
    it('should create FORGOT_PASSWORD_ERROR action', () => {
      const error = 'Email not found';
      const expectedAction = {
        type: FORGOT_PASSWORD_ERROR,
        error,
      };
      expect(forgotPasswordErrorAction(error)).toEqual(expectedAction);
    });
  });
});
