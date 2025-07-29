import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Messages from '../index';

describe('<Messages />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: {
          messages: [
            {
              id: 1,
              title: 'Test Message',
              content: 'Test content',
              date: '2023-01-01',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Messages />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with empty messages array', () => {
    const initialState = {
      global: {
        user: { messages: [] },
      },
    };

    const { container } = renderWithProviders(<Messages />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple messages', () => {
    const initialState = {
      global: {
        user: {
          messages: [
            {
              id: 1,
              title: 'Message 1',
              content: 'Content 1',
              date: '2023-01-01',
            },
            {
              id: 2,
              title: 'Message 2',
              content: 'Content 2',
              date: '2023-01-02',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Messages />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<Messages />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
