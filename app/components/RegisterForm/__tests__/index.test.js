import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import RegisterForm from '../index';

describe('<RegisterForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      register: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        currency: 'USD',
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<RegisterForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with form data', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      register: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        currency: 'EUR',
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<RegisterForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form validation', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
        error: null,
      },
      register: {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123',
        currency: 'USD',
        isLoading: false,
        error: 'Please fill all required fields',
      },
    };

    const { container } = renderWithProviders(<RegisterForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
