import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import {
  NEXT_STEP,
  PREVIOUS_STEP,
  CHANGE_INPUT_NUMBER,
  CHANGE_INPUT,
} from 'containers/App/constants';

const initialState = {
  pinCode: '',
  password: '',
  currentStep: 0,
};

const loginPageReducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_INPUT_NUMBER:
      // eslint-disable-next-line no-param-reassign
      draft[action.name] = parseInt(action.value, 10) || '';
      return draft;
    case CHANGE_INPUT:
      // eslint-disable-next-line no-param-reassign
      draft[action.name] = action.value;
      return draft;
    case NEXT_STEP:
      // eslint-disable-next-line no-param-reassign
      draft.currentStep += 1;
      return draft;
    case PREVIOUS_STEP:
      // eslint-disable-next-line no-param-reassign
      draft.currentStep -= 1;
      return draft;
    case LOCATION_CHANGE:
      return initialState;
    default:
      return draft;
  }
}, initialState);

describe('loginPageReducer', () => {
  it('should return the initial state', () => {
    expect(loginPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle LOCATION_CHANGE', () => {
    const action = { type: LOCATION_CHANGE };
    expect(loginPageReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle NEXT_STEP when on login path', () => {
    const action = { type: NEXT_STEP };
    const expectedState = { ...initialState, currentStep: 1 };
    expect(loginPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PREVIOUS_STEP when on login path', () => {
    const currentState = { ...initialState, currentStep: 1 };
    const action = { type: PREVIOUS_STEP };
    const expectedState = { ...initialState, currentStep: 0 };
    expect(loginPageReducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_INPUT when on login path', () => {
    const action = {
      type: CHANGE_INPUT,
      name: 'password',
      value: 'newpassword',
    };
    const expectedState = { ...initialState, password: 'newpassword' };
    expect(loginPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_INPUT_NUMBER when on login path', () => {
    const action = {
      type: CHANGE_INPUT_NUMBER,
      name: 'pinCode',
      value: '1234',
    };
    const expectedState = { ...initialState, pinCode: 1234 };
    expect(loginPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_INPUT_NUMBER with empty value when on login path', () => {
    const action = { type: CHANGE_INPUT_NUMBER, name: 'pinCode', value: '' };
    const expectedState = { ...initialState, pinCode: '' };
    expect(loginPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle actions when on login path', () => {
    const action = { type: NEXT_STEP };
    const expectedState = { ...initialState, currentStep: 1 };
    expect(loginPageReducer(initialState, action)).toEqual(expectedState);
  });
});
