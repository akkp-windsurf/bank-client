import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Navigation from '../index';

const mockStore = configureStore([]);

const renderWithProviders = (
  component,
  initialState = {},
  initialEntries = ['/'],
) => {
  const store = mockStore({
    app: {
      location: { pathname: initialEntries[0] },
      ...initialState,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    </Provider>,
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Menu Rendering', () => {
    it('should render all navigation items', () => {
      renderWithProviders(<Navigation />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('Cards')).toBeInTheDocument();
      expect(screen.getByText('Credits')).toBeInTheDocument();
      expect(screen.getByText('Deposits')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render navigation icons', () => {
      renderWithProviders(<Navigation />);

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(7);

      menuItems.forEach((item) => {
        const icon = item.querySelector('.anticon');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should render navigation links', () => {
      renderWithProviders(<Navigation />);

      expect(
        screen.getByRole('link', { name: /dashboard/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /payment/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /history/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /settings/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Active State Management', () => {
    it('should highlight dashboard item when on dashboard route', () => {
      renderWithProviders(<Navigation />, {}, ['/dashboard']);

      const dashboardItem = screen.getByRole('menuitem', {
        name: /dashboard/i,
      });
      expect(dashboardItem).toHaveClass('ant-menu-item-selected');
    });

    it('should highlight payment item when on payment route', () => {
      renderWithProviders(<Navigation />, {}, ['/payment']);

      const paymentItem = screen.getByRole('menuitem', { name: /payment/i });
      expect(paymentItem).toHaveClass('ant-menu-item-selected');
    });

    it('should highlight history item when on history route', () => {
      renderWithProviders(<Navigation />, {}, ['/history']);

      const historyItem = screen.getByRole('menuitem', { name: /history/i });
      expect(historyItem).toHaveClass('ant-menu-item-selected');
    });

    it('should highlight settings item when on settings route', () => {
      renderWithProviders(<Navigation />, {}, ['/settings']);

      const settingsItem = screen.getByRole('menuitem', { name: /settings/i });
      expect(settingsItem).toHaveClass('ant-menu-item-selected');
    });
  });

  describe('Disabled State Handling', () => {
    it('should disable cards menu item', () => {
      renderWithProviders(<Navigation />);

      const cardsItem = screen.getByRole('menuitem', { name: /cards/i });
      expect(cardsItem).toHaveClass('ant-menu-item-disabled');
    });

    it('should disable credits menu item', () => {
      renderWithProviders(<Navigation />);

      const creditsItem = screen.getByRole('menuitem', { name: /credits/i });
      expect(creditsItem).toHaveClass('ant-menu-item-disabled');
    });

    it('should disable deposits menu item', () => {
      renderWithProviders(<Navigation />);

      const depositsItem = screen.getByRole('menuitem', { name: /deposits/i });
      expect(depositsItem).toHaveClass('ant-menu-item-disabled');
    });

    it('should not disable enabled menu items', () => {
      renderWithProviders(<Navigation />);

      const dashboardItem = screen.getByRole('menuitem', {
        name: /dashboard/i,
      });
      const paymentItem = screen.getByRole('menuitem', { name: /payment/i });
      const historyItem = screen.getByRole('menuitem', { name: /history/i });
      const settingsItem = screen.getByRole('menuitem', { name: /settings/i });

      expect(dashboardItem).not.toHaveClass('ant-menu-item-disabled');
      expect(paymentItem).not.toHaveClass('ant-menu-item-disabled');
      expect(historyItem).not.toHaveClass('ant-menu-item-disabled');
      expect(settingsItem).not.toHaveClass('ant-menu-item-disabled');
    });
  });

  describe('Route Integration', () => {
    it('should navigate to dashboard when dashboard item is clicked', () => {
      renderWithProviders(<Navigation />);

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    it('should navigate to payment when payment item is clicked', () => {
      renderWithProviders(<Navigation />);

      const paymentLink = screen.getByRole('link', { name: /payment/i });
      expect(paymentLink).toHaveAttribute('href', '/payment');
    });

    it('should navigate to history when history item is clicked', () => {
      renderWithProviders(<Navigation />);

      const historyLink = screen.getByRole('link', { name: /history/i });
      expect(historyLink).toHaveAttribute('href', '/history');
    });

    it('should navigate to settings when settings item is clicked', () => {
      renderWithProviders(<Navigation />);

      const settingsLink = screen.getByRole('link', { name: /settings/i });
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });
  });

  describe('Menu Configuration', () => {
    it('should render menu with light theme', () => {
      renderWithProviders(<Navigation />);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('ant-menu-light');
    });

    it('should render menu in inline mode', () => {
      renderWithProviders(<Navigation />);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('ant-menu-inline');
    });
  });

  describe('Redux Integration', () => {
    it('should connect to location state from Redux store', () => {
      const initialState = {
        location: { pathname: '/dashboard' },
      };

      renderWithProviders(<Navigation />, initialState, ['/dashboard']);

      const dashboardItem = screen.getByRole('menuitem', {
        name: /dashboard/i,
      });
      expect(dashboardItem).toHaveClass('ant-menu-item-selected');
    });

    it('should update selected item based on location state changes', () => {
      renderWithProviders(<Navigation />, {}, ['/dashboard']);

      const dashboardItem = screen.getByRole('menuitem', {
        name: /dashboard/i,
      });
      expect(dashboardItem).toHaveClass('ant-menu-item-selected');

      renderWithProviders(<Navigation />, {}, ['/payment']);

      const paymentItem = screen.getByRole('menuitem', { name: /payment/i });
      expect(paymentItem).toHaveClass('ant-menu-item-selected');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      renderWithProviders(<Navigation />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getAllByRole('menuitem')).toHaveLength(7);
    });

    it('should have accessible navigation links', () => {
      renderWithProviders(<Navigation />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
      });
    });
  });
});
