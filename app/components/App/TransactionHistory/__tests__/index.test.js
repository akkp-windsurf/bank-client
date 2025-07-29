import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import TransactionHistory from '../index';

describe('<TransactionHistory />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: {
          transactions: [
            {
              id: 1,
              amount: 100,
              type: 'credit',
              date: '2023-01-01',
              description: 'Test transaction',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<TransactionHistory />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with empty transactions array', () => {
    const initialState = {
      global: {
        user: { transactions: [] },
      },
    };

    const { container } = renderWithProviders(<TransactionHistory />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple transactions', () => {
    const initialState = {
      global: {
        user: {
          transactions: [
            {
              id: 1,
              amount: 100,
              type: 'credit',
              date: '2023-01-01',
              description: 'Credit transaction',
            },
            {
              id: 2,
              amount: -50,
              type: 'debit',
              date: '2023-01-02',
              description: 'Debit transaction',
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<TransactionHistory />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<TransactionHistory />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
