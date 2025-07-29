import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import PublicRoute from '../index';

const TestComponent = () => <div>Public Content</div>;

describe('<PublicRoute />', () => {
  it('should render children when user is not logged in', () => {
    const initialState = {
      global: { isLogged: false, token: null },
    };

    const { getByText } = renderWithProviders(
      <PublicRoute component={TestComponent} />,
      { initialState },
    );

    expect(getByText('Public Content')).toBeInTheDocument();
  });

  it('should render when user is logged in but route is not restricted', () => {
    const initialState = {
      global: { isLogged: true, token: 'test-token' },
    };

    const { getByText } = renderWithProviders(
      <PublicRoute component={TestComponent} />,
      { initialState },
    );

    expect(getByText('Public Content')).toBeInTheDocument();
  });

  it('should handle restricted access correctly', () => {
    const initialState = {
      global: { isLogged: true, token: 'test-token' },
    };

    const { queryByText } = renderWithProviders(
      <PublicRoute component={TestComponent} restricted />,
      { initialState },
    );

    expect(queryByText('Public Content')).not.toBeInTheDocument();
  });
});
