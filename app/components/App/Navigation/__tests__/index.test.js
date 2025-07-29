import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Navigation from '../index';

describe('<Navigation />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        currentRoute: '/dashboard',
      },
    };

    const { container } = renderWithProviders(<Navigation />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with navigation items', () => {
    const initialState = {
      global: {
        user: { name: 'Test User', role: 'user' },
        isLogged: true,
        currentRoute: '/payments',
      },
    };

    const { container } = renderWithProviders(<Navigation />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle different user roles', () => {
    const initialState = {
      global: {
        user: { name: 'Test User', role: 'admin' },
        isLogged: true,
        currentRoute: '/settings',
      },
    };

    const { container } = renderWithProviders(<Navigation />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
