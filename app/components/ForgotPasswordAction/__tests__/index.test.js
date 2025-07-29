import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ForgotPasswordAction from '../index';

describe('<ForgotPasswordAction />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      forgotPassword: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle forgot password loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      forgotPassword: {
        isLoading: true,
        error: null,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle forgot password error', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      forgotPassword: {
        isLoading: false,
        error: 'Email not found',
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle successful password reset request', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      forgotPassword: {
        isLoading: false,
        error: null,
        success: true,
        message: 'Reset email sent',
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
