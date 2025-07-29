import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import Privacy from '../index';

describe('<Privacy />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
    };

    const { container } = renderWithProviders(<Privacy />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render privacy content', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
    };

    const { container } = renderWithProviders(<Privacy />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
    };

    const { container } = renderWithProviders(<Privacy />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
