import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import LoginAction from '../index';

describe('<LoginAction />', () => {
  const mockProps = {
    steps: [{ title: <span>Step 1</span> }, { title: <span>Step 2</span> }],
    onValidateFields: jest.fn(),
  };

  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      login: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(<LoginAction {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle login loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      login: {
        isLoading: true,
        error: null,
      },
    };

    const { container } = renderWithProviders(<LoginAction {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle login error', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      login: {
        isLoading: false,
        error: 'Invalid credentials',
      },
    };

    const { container } = renderWithProviders(<LoginAction {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle successful login', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User' },
      },
      login: {
        isLoading: false,
        error: null,
        success: true,
      },
    };

    const { container } = renderWithProviders(<LoginAction {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
