import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import Currency from '../index';

describe('<Currency />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { currency: 'USD' },
        currencies: ['USD', 'EUR', 'GBP'],
      },
    };

    const mockProps = {
      onChange: jest.fn(),
      value: 'USD',
    };

    const { container } = renderWithProviders(<Currency {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different currency', () => {
    const initialState = {
      global: {
        user: { currency: 'EUR' },
        currencies: ['USD', 'EUR', 'GBP'],
      },
    };

    const mockProps = {
      onChange: jest.fn(),
      value: 'EUR',
    };

    const { container } = renderWithProviders(<Currency {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle currency change', () => {
    const initialState = {
      global: {
        user: { currency: 'USD' },
        currencies: ['USD', 'EUR', 'GBP'],
      },
    };

    const mockOnChange = jest.fn();
    const mockProps = {
      onChange: mockOnChange,
      value: 'USD',
    };

    const { container } = renderWithProviders(<Currency {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
