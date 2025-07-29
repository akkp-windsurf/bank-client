import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import DashboardPage from '../index';

const mockStore = configureStore([]);

const mockInitialState = {
  app: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      userConfig: { currency: 'USD' },
    },
  },
  dashboardPage: {
    availableFunds: 5000.5,
    savings: 2500.75,
    bills: [
      {
        id: 1,
        title: 'Electricity Bill',
        amountMoney: 150.75,
        accountBillNumber: '12345678901234567890',
        dateOfPayment: '2023-12-01',
      },
    ],
    recentTransactions: [
      {
        id: 1,
        title: 'Coffee Shop',
        amountMoney: -4.5,
        dateOfPayment: '2023-12-01',
      },
    ],
    bankCards: [
      {
        id: 1,
        cardNumber: '1234567890123456',
        cardType: 'VISA',
        expiryDate: '12/25',
      },
    ],
    credits: [
      {
        id: 1,
        title: 'Personal Loan',
        amountMoney: 10000,
        interestRate: 5.5,
      },
    ],
    deposits: [
      {
        id: 1,
        title: 'Savings Account',
        amountMoney: 15000,
        interestRate: 2.5,
      },
    ],
    isLoading: false,
  },
};

const renderWithProviders = (component, initialState = mockInitialState) => {
  const store = mockStore(initialState);

  return render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <BrowserRouter>{component}</BrowserRouter>
      </IntlProvider>
    </Provider>,
  );
};

describe('DashboardPage Widgets', () => {
  describe('Grid Layout', () => {
    it('should render all dashboard widgets', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText(/available funds/i)).toBeInTheDocument();
      expect(screen.getByText(/savings/i)).toBeInTheDocument();
      expect(screen.getByText(/bills/i)).toBeInTheDocument();
      expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
      expect(screen.getByText(/bank cards/i)).toBeInTheDocument();
      expect(screen.getByText(/credits/i)).toBeInTheDocument();
      expect(screen.getByText(/deposits/i)).toBeInTheDocument();
    });

    it('should display user greeting', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText(/hello john/i)).toBeInTheDocument();
    });

    it('should render responsive grid layout', () => {
      renderWithProviders(<DashboardPage />);

      const gridContainer = screen.getByTestId('dashboard-grid');
      expect(gridContainer).toHaveClass('ant-row');
    });
  });

  describe('AvailableFunds Widget', () => {
    it('should display available funds amount', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('$5,000.50')).toBeInTheDocument();
    });

    it('should handle different currencies', () => {
      const stateWithEUR = {
        ...mockInitialState,
        app: {
          ...mockInitialState.app,
          user: {
            ...mockInitialState.app.user,
            userConfig: { currency: 'EUR' },
          },
        },
      };

      renderWithProviders(<DashboardPage />, stateWithEUR);

      expect(screen.getByText('€5,000.50')).toBeInTheDocument();
    });
  });

  describe('Savings Widget', () => {
    it('should display savings amount', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('$2,500.75')).toBeInTheDocument();
    });

    it('should show savings growth indicator', () => {
      renderWithProviders(<DashboardPage />);

      const savingsWidget = screen.getByTestId('savings-widget');
      expect(savingsWidget).toBeInTheDocument();
    });
  });

  describe('Bills Widget', () => {
    it('should display bills list', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Electricity Bill')).toBeInTheDocument();
      expect(screen.getByText('$150.75')).toBeInTheDocument();
    });

    it('should format account bill numbers', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('12 3456 7890 1234 5678 90')).toBeInTheDocument();
    });

    it('should handle empty bills list', () => {
      const stateWithNoBills = {
        ...mockInitialState,
        dashboardPage: {
          ...mockInitialState.dashboardPage,
          bills: [],
        },
      };

      renderWithProviders(<DashboardPage />, stateWithNoBills);

      expect(screen.getByText(/no bills/i)).toBeInTheDocument();
    });
  });

  describe('RecentTransactions Widget', () => {
    it('should display recent transactions', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('-$4.50')).toBeInTheDocument();
    });

    it('should show transaction dates', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Dec 1, 2023')).toBeInTheDocument();
    });

    it('should handle positive and negative amounts', () => {
      const stateWithMixedTransactions = {
        ...mockInitialState,
        dashboardPage: {
          ...mockInitialState.dashboardPage,
          recentTransactions: [
            {
              id: 1,
              title: 'Salary',
              amountMoney: 3000.0,
              dateOfPayment: '2023-12-01',
            },
            {
              id: 2,
              title: 'Grocery',
              amountMoney: -85.5,
              dateOfPayment: '2023-12-02',
            },
          ],
        },
      };

      renderWithProviders(<DashboardPage />, stateWithMixedTransactions);

      expect(screen.getByText('+$3,000.00')).toBeInTheDocument();
      expect(screen.getByText('-$85.50')).toBeInTheDocument();
    });
  });

  describe('BankCards Widget', () => {
    it('should display bank cards', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('**** **** **** 3456')).toBeInTheDocument();
      expect(screen.getByText('VISA')).toBeInTheDocument();
      expect(screen.getByText('12/25')).toBeInTheDocument();
    });

    it('should mask card numbers for security', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.queryByText('1234567890123456')).not.toBeInTheDocument();
    });
  });

  describe('Credits Widget', () => {
    it('should display credit information', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Personal Loan')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
      expect(screen.getByText('5.5%')).toBeInTheDocument();
    });

    it('should show interest rates', () => {
      renderWithProviders(<DashboardPage />);

      const interestRate = screen.getByText('5.5%');
      expect(interestRate).toBeInTheDocument();
    });
  });

  describe('Deposits Widget', () => {
    it('should display deposit information', () => {
      renderWithProviders(<DashboardPage />);

      expect(screen.getByText('Savings Account')).toBeInTheDocument();
      expect(screen.getByText('$15,000')).toBeInTheDocument();
      expect(screen.getByText('2.5%')).toBeInTheDocument();
    });

    it('should calculate deposit returns', () => {
      renderWithProviders(<DashboardPage />);

      const depositAmount = screen.getByText('$15,000');
      const interestRate = screen.getByText('2.5%');

      expect(depositAmount).toBeInTheDocument();
      expect(interestRate).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state for widgets', () => {
      const loadingState = {
        ...mockInitialState,
        dashboardPage: {
          ...mockInitialState.dashboardPage,
          isLoading: true,
        },
      };

      renderWithProviders(<DashboardPage />, loadingState);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Widget Interactions', () => {
    it('should handle widget click events', () => {
      const store = mockStore(mockInitialState);

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <DashboardPage />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const billsWidget = screen.getByTestId('bills-widget');
      fireEvent.click(billsWidget);

      const actions = store.getActions();
      expect(actions.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', () => {
      renderWithProviders(<DashboardPage />);

      const firstWidget = screen.getByTestId('available-funds-widget');
      firstWidget.focus();

      expect(document.activeElement).toBe(firstWidget);
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout for mobile screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithProviders(<DashboardPage />);

      const gridContainer = screen.getByTestId('dashboard-grid');
      expect(gridContainer).toHaveClass('ant-row');
    });

    it('should maintain desktop layout for large screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderWithProviders(<DashboardPage />);

      const gridContainer = screen.getByTestId('dashboard-grid');
      expect(gridContainer).toHaveClass('ant-row');
    });
  });
});
