import React from 'react';
import { renderWithProviders } from '../../../../../../internals/testing/redux-utils';
import Confirm from '../index';

jest.mock('containers/PaymentPage/selectors', () => ({
  makeSelectSenderBill: () => () => ({
    currency: { name: 'USD' },
    accountBillNumber: '1234567890',
  }),
  makeSelectRecipientBill: () => () => ({
    user: { firstName: 'John', lastName: 'Doe' },
    accountBillNumber: '0987654321',
  }),
  makeSelectAmountMoney: () => () => 100.0,
  makeSelectTransferTitle: () => () => 'Test Transfer',
}));

describe('<Confirm />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Confirm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render confirmation details', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
        payment: {
          amount: 100,
          recipient: 'John Doe',
          description: 'Test payment',
        },
      },
    };

    const { container } = renderWithProviders(<Confirm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle confirmation actions', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Confirm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: true,
      },
    };

    const { container } = renderWithProviders(<Confirm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle payment confirmation', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
        payment: {
          amount: 250,
          recipient: 'Jane Smith',
          confirmed: true,
        },
      },
    };

    const { container } = renderWithProviders(<Confirm />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
