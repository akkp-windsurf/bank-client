import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ForgotPasswordRedirect from '../index';

describe('<ForgotPasswordRedirect />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordRedirect />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle redirect with token', () => {
    const initialState = {
      global: {
        isLogged: false,
        resetToken: 'test-token-123',
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordRedirect />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: true,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordRedirect />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const initialState = {
      global: {
        isLogged: false,
        error: 'Invalid reset token',
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordRedirect />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
