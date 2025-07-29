import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import HomePage from '../index';

const mockPush = jest.fn();
jest.mock('connected-react-router', () => ({
  ...jest.requireActual('connected-react-router'),
  push: (path) => {
    mockPush(path);
    return {
      type: '@@router/CALL_HISTORY_METHOD',
      payload: { method: 'push', args: [path] },
    };
  },
}));

describe('<HomePage />', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render and match the snapshot', () => {
    const initialState = {
      global: { isLogged: false, token: null },
    };

    const { container } = renderWithProviders(<HomePage />, { initialState });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should redirect to dashboard when user is logged in', () => {
    const initialState = {
      global: { isLogged: true, token: 'test-token' },
    };

    renderWithProviders(<HomePage />, { initialState });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should redirect to login when user is not logged in', () => {
    const initialState = {
      global: { isLogged: false, token: null },
    };

    renderWithProviders(<HomePage />, { initialState });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should render null', () => {
    const initialState = {
      global: { isLogged: false, token: null },
    };

    const { container } = renderWithProviders(<HomePage />, { initialState });
    expect(container.firstChild).toBeNull();
  });
});
