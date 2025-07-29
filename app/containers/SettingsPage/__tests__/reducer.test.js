import { LOCATION_CHANGE } from 'connected-react-router';
import settingsPageReducer, { initialState } from '../reducer';
import {
  getUserDataSuccessAction,
  getUserDataErrorAction,
  setUserDataSuccessAction,
  setUserDataIncorrectAction,
} from '../actions';

describe('settingsPageReducer', () => {
  it('should return the initial state', () => {
    expect(settingsPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle GET_USER_DATA_SUCCESS', () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const action = getUserDataSuccessAction(userData);
    const expectedState = {
      ...initialState,
      user: userData,
      newData: {},
      isOpenedModal: false,
    };
    expect(settingsPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle GET_USER_DATA_ERROR', () => {
    const error = 'Failed to fetch user data';
    const action = getUserDataErrorAction(error);
    expect(settingsPageReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle SET_USER_DATA_SUCCESS', () => {
    const userData = { name: 'Jane Doe', email: 'jane@example.com' };
    const action = setUserDataSuccessAction(userData);
    const expectedState = {
      ...initialState,
      user: userData,
      newData: {},
      isOpenedModal: false,
    };
    expect(settingsPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_USER_DATA_INCORRECT', () => {
    const error = 'Invalid data';
    const action = setUserDataIncorrectAction(error);
    const expectedState = {
      ...initialState,
      isOpenedModal: false,
    };
    expect(settingsPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should reset state on LOCATION_CHANGE', () => {
    const currentState = {
      isOpenedModal: true,
      user: { name: 'John' },
      newData: { name: 'Jane' },
    };
    const action = { type: LOCATION_CHANGE };
    expect(settingsPageReducer(currentState, action)).toEqual(initialState);
  });
});
