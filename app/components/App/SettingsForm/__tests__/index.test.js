import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import SettingsForm from '../index';

describe('<SettingsForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
        },
        isLogged: true,
      },
      settings: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<SettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with user settings', () => {
    const initialState = {
      global: {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          preferences: {
            notifications: true,
            theme: 'dark',
          },
        },
        isLogged: true,
      },
      settings: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<SettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form submission loading', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        isLogged: true,
      },
      settings: {
        isLoading: true,
        error: null,
      },
    };

    const { container } = renderWithProviders(<SettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form validation errors', () => {
    const initialState = {
      global: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
        isLogged: true,
      },
      settings: {
        isLoading: false,
        error: 'Invalid email format',
      },
    };

    const { container } = renderWithProviders(<SettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
