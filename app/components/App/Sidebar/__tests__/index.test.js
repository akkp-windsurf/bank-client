import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Sidebar from '../index';

describe('<Sidebar />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        sidebar: {
          isOpen: true,
        },
      },
    };

    const { container } = renderWithProviders(<Sidebar />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with navigation items', () => {
    const initialState = {
      global: {
        user: { name: 'Test User', role: 'user' },
        isLogged: true,
        sidebar: {
          isOpen: true,
          selectedItem: 'dashboard',
        },
      },
    };

    const { container } = renderWithProviders(<Sidebar />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle collapsed state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
        sidebar: {
          isOpen: false,
        },
      },
    };

    const { container } = renderWithProviders(<Sidebar />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
