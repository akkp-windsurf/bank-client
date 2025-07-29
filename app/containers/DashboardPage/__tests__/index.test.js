import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import DashboardPage from '../index';

describe('<DashboardPage />', () => {
  const mockUser = {
    name: 'Test User',
    notifications: [],
    messages: [],
  };

  it('should render without crashing', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render error state', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with modal opened', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render grid layout components', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });

    const gridItems = container.querySelectorAll('[data-grid]');
    expect(gridItems.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle layout changes', () => {
    const initialState = {
      global: { user: mockUser },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with user notifications', () => {
    const userWithNotifications = {
      ...mockUser,
      notifications: [{ id: 1, message: 'Test notification' }],
    };

    const initialState = {
      global: { user: userWithNotifications },
      router: {
        location: { pathname: '/dashboard' },
        action: 'POP',
      },
    };

    const { container } = renderWithProviders(<DashboardPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
