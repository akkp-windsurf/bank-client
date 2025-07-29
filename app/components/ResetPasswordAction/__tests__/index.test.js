import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ResetPasswordAction from '../index';

describe('<ResetPasswordAction />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with reset password state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      resetPassword: {
        isLoading: false,
        error: null,
        success: false,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      resetPassword: {
        isLoading: true,
        error: null,
        success: false,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordAction />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
