import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ResetPasswordPage from '../index';

describe('<ResetPasswordPage />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      resetPassword: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with reset token', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      resetPassword: {
        isLoading: false,
        error: null,
        token: 'reset-token-123',
      },
    };

    const { container } = renderWithProviders(<ResetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      resetPassword: {
        isLoading: true,
        error: null,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      resetPassword: {
        isLoading: false,
        error: 'Invalid or expired token',
      },
    };

    const { container } = renderWithProviders(<ResetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
