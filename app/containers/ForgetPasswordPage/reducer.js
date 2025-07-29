/*
 *
 * ForgetPasswordPage reducer
 *
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { CHANGE_INPUT } from 'containers/App/constants';
import produce from 'immer';
import { routes } from 'utils';
import { FORGOT_PASSWORD_SUCCESS } from './constants';

export const initialState = {
  email: '',
  isSuccess: false,
};

/* eslint-disable default-case, no-param-reassign, consistent-return */
const forgetPasswordPageReducer = produce((draft, action) => {
  if (window.location.pathname === routes.forgetPassword.path) {
    switch (action.type) {
      case CHANGE_INPUT:
        draft[action.name] = action.value;
        break;
      case FORGOT_PASSWORD_SUCCESS:
        draft.isSuccess = true;
        break;
      default:
        break;
    }
  }
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    default:
      break;
  }
}, initialState);

export default forgetPasswordPageReducer;
