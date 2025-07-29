import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import BankCards from '../index';

describe('<BankCards />', () => {
  it('should render a BankCards', () => {
    const initialState = {
      global: {
        user: {
          cards: [
            { id: 1, number: '1234567890123456', type: 'visa', balance: 1000 },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<BankCards />, { initialState });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with empty cards array', () => {
    const initialState = {
      global: {
        user: { cards: [] },
      },
    };

    const { container } = renderWithProviders(<BankCards />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple cards', () => {
    const initialState = {
      global: {
        user: {
          cards: [
            { id: 1, number: '1234567890123456', type: 'visa', balance: 1000 },
            {
              id: 2,
              number: '9876543210987654',
              type: 'mastercard',
              balance: 2000,
            },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<BankCards />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<BankCards />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
