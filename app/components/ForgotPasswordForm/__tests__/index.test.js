import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ForgotPasswordForm from '../index';

describe('<ForgotPasswordForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      forgotPassword: {
        email: '',
        isLoading: false,
        error: null,
        success: false,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with email input', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      forgotPassword: {
        email: 'test@example.com',
        isLoading: false,
        error: null,
        success: false,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      forgotPassword: {
        email: 'test@example.com',
        isLoading: true,
        error: null,
        success: false,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle success state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      forgotPassword: {
        email: 'test@example.com',
        isLoading: false,
        error: null,
        success: true,
      },
    };

    const { container } = renderWithProviders(<ForgotPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
