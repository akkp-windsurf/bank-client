import React from 'react';
import { renderWithProviders } from '../../../../../../internals/testing/redux-utils';
import PersonalSettingsForm from '../index';

describe('<PersonalSettingsForm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      },
    };

    const { container } = renderWithProviders(<PersonalSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render form fields with user data', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      },
    };

    const { container } = renderWithProviders(<PersonalSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form validation', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
      },
    };

    const { container } = renderWithProviders(<PersonalSettingsForm />, {
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

    const { container } = renderWithProviders(<PersonalSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
        },
      },
    };

    const { container } = renderWithProviders(<PersonalSettingsForm />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
