import {
  resetPasswordAction,
  resetPasswordSuccessAction,
  resetPasswordErrorAction,
} from '../actions';
import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from '../constants';

describe('ResetPasswordPage actions', () => {
  describe('resetPasswordAction', () => {
    it('should create RESET_PASSWORD_REQUEST action', () => {
      const expectedAction = {
        type: RESET_PASSWORD_REQUEST,
      };
      expect(resetPasswordAction()).toEqual(expectedAction);
    });
  });

  describe('resetPasswordSuccessAction', () => {
    it('should create RESET_PASSWORD_SUCCESS action', () => {
      const expectedAction = {
        type: RESET_PASSWORD_SUCCESS,
      };
      expect(resetPasswordSuccessAction()).toEqual(expectedAction);
    });
  });

  describe('resetPasswordErrorAction', () => {
    it('should create RESET_PASSWORD_ERROR action', () => {
      const error = 'Invalid token';
      const expectedAction = {
        type: RESET_PASSWORD_ERROR,
        error,
      };
      expect(resetPasswordErrorAction(error)).toEqual(expectedAction);
    });
  });
});
