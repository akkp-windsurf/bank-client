import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import PrivateRoute from '../index';

const TestComponent = () => <div>Private Content</div>;

describe('<PrivateRoute />', () => {
  it('should render children when user is logged in', () => {
    const initialState = {
      global: { isLogged: true, token: 'test-token' },
    };

    const { getByText } = renderWithProviders(
      <PrivateRoute component={TestComponent} />,
      { initialState },
    );

    expect(getByText('Private Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not logged in', () => {
    const initialState = {
      global: { isLogged: false, token: null },
    };

    const { queryByText } = renderWithProviders(
      <PrivateRoute component={TestComponent} />,
      { initialState },
    );

    expect(queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('should render when user is logged in even without token', () => {
    const initialState = {
      global: { isLogged: true, token: null },
    };

    const { getByText } = renderWithProviders(
      <PrivateRoute component={TestComponent} />,
      { initialState },
    );

    expect(getByText('Private Content')).toBeInTheDocument();
  });
});
