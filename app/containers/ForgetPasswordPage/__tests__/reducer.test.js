import { LOCATION_CHANGE } from 'connected-react-router';
import forgetPasswordPageReducer, { initialState } from '../reducer';

describe('forgetPasswordPageReducer', () => {
  it('should return the initial state', () => {
    expect(forgetPasswordPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should reset state on LOCATION_CHANGE', () => {
    const currentState = {
      email: 'test@example.com',
      isSuccess: true,
    };
    const action = { type: LOCATION_CHANGE };
    expect(forgetPasswordPageReducer(currentState, action)).toEqual(
      initialState,
    );
  });

  it('should handle unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(forgetPasswordPageReducer(initialState, action)).toEqual(
      initialState,
    );
  });
});
