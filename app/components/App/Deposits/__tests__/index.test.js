import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Deposits from '../index';

describe('<Deposits />', () => {
  it('should render a Deposits', () => {
    const initialState = {
      global: {
        user: {
          deposits: [{ id: 1, amount: 10000, interestRate: 3.5, term: 12 }],
        },
      },
    };

    const { container } = renderWithProviders(<Deposits />, { initialState });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with empty deposits array', () => {
    const initialState = {
      global: {
        user: { deposits: [] },
      },
    };

    const { container } = renderWithProviders(<Deposits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple deposits', () => {
    const initialState = {
      global: {
        user: {
          deposits: [
            { id: 1, amount: 10000, interestRate: 3.5, term: 12 },
            { id: 2, amount: 25000, interestRate: 4.1, term: 24 },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Deposits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<Deposits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
