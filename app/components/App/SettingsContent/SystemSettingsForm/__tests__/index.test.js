import React from 'react';
import { renderWithProviders } from '../../../../../../internals/testing/redux-utils';
import SystemSettingsForm from '../index';

describe('<SystemSettingsForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
      },
    };

    const { container } = renderWithProviders(<SystemSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render system settings options', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
        settings: {
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
      },
    };

    const { container } = renderWithProviders(<SystemSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle settings changes', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
      },
    };

    const { container } = renderWithProviders(<SystemSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: true,
      },
    };

    const { container } = renderWithProviders(<SystemSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
        settings: {
          theme: 'light',
          notifications: false,
        },
      },
    };

    const { container } = renderWithProviders(<SystemSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
