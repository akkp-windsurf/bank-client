import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Notifications from '../index';

describe('<Notifications />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: {
          notifications: [
            {
              id: 1,
              title: 'Test Notification',
              message: 'Test message',
              type: 'info',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Notifications />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with empty notifications array', () => {
    const initialState = {
      global: {
        user: { notifications: [] },
      },
    };

    const { container } = renderWithProviders(<Notifications />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple notifications', () => {
    const initialState = {
      global: {
        user: {
          notifications: [
            {
              id: 1,
              title: 'Notification 1',
              message: 'Message 1',
              type: 'info',
            },
            {
              id: 2,
              title: 'Notification 2',
              message: 'Message 2',
              type: 'warning',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Notifications />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<Notifications />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
