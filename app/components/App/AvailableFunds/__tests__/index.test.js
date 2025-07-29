import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import AvailableFunds from '../index';

const mockStore = configureStore([]);

const renderWithProviders = (component, initialState = {}) => {
  const store = mockStore({
    app: {
      user: {
        userConfig: { currency: 'USD' },
        ...initialState.user,
      },
    },
    dashboardPage: {
      availableFunds: 5000.5,
      ...initialState.dashboardPage,
    },
  });

  return render(
    <Provider store={store}>
      <IntlProvider locale="en">{component}</IntlProvider>
    </Provider>,
  );
};

describe('AvailableFunds', () => {
  it('should render available funds amount', () => {
    renderWithProviders(<AvailableFunds />);

    expect(screen.getByText(/available funds/i)).toBeInTheDocument();
    expect(screen.getByText('$5,000.50')).toBeInTheDocument();
  });

  it('should display currency symbol based on user config', () => {
    renderWithProviders(<AvailableFunds />, {
      user: { userConfig: { currency: 'EUR' } },
    });

    expect(screen.getByText('€5,000.50')).toBeInTheDocument();
  });

  it('should handle zero balance', () => {
    renderWithProviders(<AvailableFunds />, {
      dashboardPage: { availableFunds: 0 },
    });

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('should format large amounts correctly', () => {
    renderWithProviders(<AvailableFunds />, {
      dashboardPage: { availableFunds: 1234567.89 },
    });

    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
  });

  it('should handle negative balance', () => {
    renderWithProviders(<AvailableFunds />, {
      dashboardPage: { availableFunds: -500.25 },
    });

    expect(screen.getByText('-$500.25')).toBeInTheDocument();
  });
});
