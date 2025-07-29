import {
  getUserDataAction,
  getUserDataSuccessAction,
  getUserDataErrorAction,
  setUserDataAction,
  setUserDataSuccessAction,
  setUserDataIncorrectAction,
} from '../actions';
import {
  GET_USER_DATA_REQUEST,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_ERROR,
  SET_USER_DATA_REQUEST,
  SET_USER_DATA_SUCCESS,
  SET_USER_DATA_INCORRECT,
} from '../constants';

describe('SettingsPage actions', () => {
  describe('getUserDataAction', () => {
    it('should create GET_USER_DATA_REQUEST action', () => {
      const expectedAction = {
        type: GET_USER_DATA_REQUEST,
      };
      expect(getUserDataAction()).toEqual(expectedAction);
    });
  });

  describe('getUserDataSuccessAction', () => {
    it('should create GET_USER_DATA_SUCCESS action', () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const expectedAction = {
        type: GET_USER_DATA_SUCCESS,
        userData,
      };
      expect(getUserDataSuccessAction(userData)).toEqual(expectedAction);
    });
  });

  describe('getUserDataErrorAction', () => {
    it('should create GET_USER_DATA_ERROR action', () => {
      const error = 'Failed to fetch user data';
      const expectedAction = {
        type: GET_USER_DATA_ERROR,
        error,
      };
      expect(getUserDataErrorAction(error)).toEqual(expectedAction);
    });
  });

  describe('setUserDataAction', () => {
    it('should create SET_USER_DATA_REQUEST action', () => {
      const snippets = { name: 'Jane Doe' };
      const expectedAction = {
        type: SET_USER_DATA_REQUEST,
        snippets,
      };
      expect(setUserDataAction(snippets)).toEqual(expectedAction);
    });
  });

  describe('setUserDataSuccessAction', () => {
    it('should create SET_USER_DATA_SUCCESS action', () => {
      const userData = { name: 'Jane Doe', email: 'jane@example.com' };
      const expectedAction = {
        type: SET_USER_DATA_SUCCESS,
        userData,
      };
      expect(setUserDataSuccessAction(userData)).toEqual(expectedAction);
    });
  });

  describe('setUserDataIncorrectAction', () => {
    it('should create SET_USER_DATA_INCORRECT action', () => {
      const error = 'Invalid data';
      const expectedAction = {
        type: SET_USER_DATA_INCORRECT,
        error,
      };
      expect(setUserDataIncorrectAction(error)).toEqual(expectedAction);
    });
  });
});
