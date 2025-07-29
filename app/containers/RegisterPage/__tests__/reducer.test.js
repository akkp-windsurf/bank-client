import produce from 'immer';
import { LOCATION_CHANGE } from 'connected-react-router';
import {
  SELECT_CURRENCY,
  NEXT_STEP,
  CHANGE_INPUT,
  PREVIOUS_STEP,
} from 'containers/App/constants';
import { registerSuccessAction } from '../actions';
import { REGISTER_SUCCESS } from '../constants';

const initialState = {
  firstName: '',
  lastName: '',
  currency: null,
  email: '',
  password: '',
  pinCode: '',
  currentStep: 0,
};

const registerPageReducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_INPUT:
      // eslint-disable-next-line no-param-reassign
      draft[action.name] = action.value.trim();
      return draft;
    case SELECT_CURRENCY:
      // eslint-disable-next-line no-param-reassign
      draft.currency = action.currency;
      return draft;
    case NEXT_STEP:
      // eslint-disable-next-line no-param-reassign
      draft.currentStep += 1;
      return draft;
    case PREVIOUS_STEP:
      // eslint-disable-next-line no-param-reassign
      draft.currentStep -= 1;
      return draft;
    case REGISTER_SUCCESS:
      // eslint-disable-next-line no-param-reassign
      draft.pinCode = action.pinCode;
      return draft;
    case LOCATION_CHANGE:
      return initialState;
    default:
      return draft;
  }
}, initialState);

describe('registerPageReducer', () => {
  it('should return the initial state', () => {
    expect(registerPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the registerSuccess action correctly', () => {
    const fixture = 1231;

    const expectedResult = produce(initialState, (draft) => {
      // eslint-disable-next-line no-param-reassign
      draft.pinCode = fixture;
    });

    expect(
      registerPageReducer(initialState, registerSuccessAction(fixture)),
    ).toEqual(expectedResult);
  });

  it('should handle LOCATION_CHANGE', () => {
    const action = { type: LOCATION_CHANGE };
    expect(registerPageReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle SELECT_CURRENCY when on register path', () => {
    const currency = { id: 1, name: 'USD' };
    const action = { type: SELECT_CURRENCY, currency };
    const expectedState = { ...initialState, currency };
    expect(registerPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle NEXT_STEP when on register path', () => {
    const action = { type: NEXT_STEP };
    const expectedState = { ...initialState, currentStep: 1 };
    expect(registerPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PREVIOUS_STEP when on register path', () => {
    const currentState = { ...initialState, currentStep: 1 };
    const action = { type: PREVIOUS_STEP };
    const expectedState = { ...initialState, currentStep: 0 };
    expect(registerPageReducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_INPUT when on register path', () => {
    const action = { type: CHANGE_INPUT, name: 'firstName', value: '  John  ' };
    const expectedState = { ...initialState, firstName: 'John' };
    expect(registerPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REGISTER_SUCCESS', () => {
    const pinCode = '1234';
    const action = { type: REGISTER_SUCCESS, pinCode };
    const expectedState = { ...initialState, pinCode };
    expect(registerPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle actions when on register path', () => {
    const action = { type: NEXT_STEP };
    const expectedState = { ...initialState, currentStep: 1 };
    expect(registerPageReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle multiple CHANGE_INPUT actions', () => {
    let state = initialState;

    const action1 = {
      type: CHANGE_INPUT,
      name: 'firstName',
      value: '  John  ',
    };
    state = registerPageReducer(state, action1);
    expect(state.firstName).toBe('John');

    const action2 = { type: CHANGE_INPUT, name: 'lastName', value: '  Doe  ' };
    state = registerPageReducer(state, action2);
    expect(state.lastName).toBe('Doe');

    const action3 = {
      type: CHANGE_INPUT,
      name: 'email',
      value: '  john@example.com  ',
    };
    state = registerPageReducer(state, action3);
    expect(state.email).toBe('john@example.com');
  });
});
