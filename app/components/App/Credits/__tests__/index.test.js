import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Credits from '../index';

describe('<Credits />', () => {
  it('should render a Credits', () => {
    const initialState = {
      global: {
        user: {
          credits: [{ id: 1, amount: 5000, interestRate: 5.5, term: 12 }],
        },
      },
    };

    const { container } = renderWithProviders(<Credits />, { initialState });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with empty credits array', () => {
    const initialState = {
      global: {
        user: { credits: [] },
      },
    };

    const { container } = renderWithProviders(<Credits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with multiple credits', () => {
    const initialState = {
      global: {
        user: {
          credits: [
            { id: 1, amount: 5000, interestRate: 5.5, term: 12 },
            { id: 2, amount: 10000, interestRate: 4.2, term: 24 },
          ],
        },
      },
    };

    const { container } = renderWithProviders(<Credits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing user data', () => {
    const initialState = {
      global: { user: null },
    };

    const { container } = renderWithProviders(<Credits />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });
});
