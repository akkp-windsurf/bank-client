import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import LoginForm from '../index';

describe('<LoginForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      login: {
        email: '',
        password: '',
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<LoginForm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with form data', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      login: {
        email: 'test@example.com',
        password: 'password123',
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<LoginForm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form validation errors', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      login: {
        email: 'invalid-email',
        password: '',
        isLoading: false,
        error: 'Invalid email or password',
      },
    };

    const { container } = renderWithProviders(<LoginForm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
