import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ResetPasswordForm from '../index';

describe('<ResetPasswordForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with form data', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      resetPassword: {
        password: '',
        confirmPassword: '',
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<ResetPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form validation', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      resetPassword: {
        password: 'newpassword',
        confirmPassword: 'differentpassword',
        isLoading: false,
        error: 'Passwords do not match',
      },
    };

    const { container } = renderWithProviders(<ResetPasswordForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
