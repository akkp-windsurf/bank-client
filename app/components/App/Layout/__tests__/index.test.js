import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Layout from '../index';

describe('<Layout />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
    };

    const mockProps = {
      children: <div>Test Content</div>,
    };

    const { container } = renderWithProviders(<Layout {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with sidebar', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        layout: {
          sidebarOpen: true,
        },
      },
    };

    const mockProps = {
      children: <div>Test Content</div>,
    };

    const { container } = renderWithProviders(<Layout {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle responsive layout', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        layout: {
          isMobile: true,
          sidebarOpen: false,
        },
      },
    };

    const mockProps = {
      children: <div>Mobile Content</div>,
    };

    const { container } = renderWithProviders(<Layout {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
