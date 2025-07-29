import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import AvailableFunds from '../index';

describe('<AvailableFunds />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          availableFunds: 2500.75,
        },
        isLogged: true,
      },
    };

    const { container } = renderWithProviders(<AvailableFunds />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different fund amounts', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          availableFunds: 10000.0,
        },
        isLogged: true,
      },
    };

    const { container } = renderWithProviders(<AvailableFunds />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle zero funds', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          availableFunds: 0,
        },
        isLogged: true,
      },
    };

    const { container } = renderWithProviders(<AvailableFunds />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        isLoading: true,
      },
    };

    const { container } = renderWithProviders(<AvailableFunds />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
