import { LOCATION_CHANGE } from 'connected-react-router';
import resetPasswordPageReducer, { initialState } from '../reducer';

describe('resetPasswordPageReducer', () => {
  it('should return the initial state', () => {
    expect(resetPasswordPageReducer(undefined, {})).toEqual(initialState);
  });

  it('should reset state on LOCATION_CHANGE', () => {
    const currentState = {
      password: 'newpassword123',
      password2: 'newpassword123',
      isSuccess: true,
      token: 'token123',
    };
    const action = { type: LOCATION_CHANGE };
    expect(resetPasswordPageReducer(currentState, action)).toEqual(
      initialState,
    );
  });

  it('should handle unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(resetPasswordPageReducer(initialState, action)).toEqual(
      initialState,
    );
  });
});
