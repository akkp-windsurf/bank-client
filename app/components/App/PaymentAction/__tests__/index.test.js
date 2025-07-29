import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import PaymentAction from '../index';

describe('<PaymentAction />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        isLoading: false,
        error: null,
      },
    };

    const mockProps = {
      steps: [
        { title: <span>Step 1</span> },
        { title: <span>Step 2</span> },
        { title: <span>Step 3</span> },
      ],
      onValidateFields: jest.fn(),
    };

    const { container } = renderWithProviders(
      <PaymentAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with payment actions', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        actions: ['send', 'request', 'split'],
        isLoading: false,
        error: null,
      },
    };

    const mockProps = {
      steps: [
        { title: <span>Amount</span> },
        { title: <span>Recipient</span> },
        { title: <span>Confirm</span> },
      ],
      onValidateFields: jest.fn(),
    };

    const { container } = renderWithProviders(
      <PaymentAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        isLoading: true,
        error: null,
      },
    };

    const mockProps = {
      steps: [{ title: <span>Step 1</span> }, { title: <span>Step 2</span> }],
      onValidateFields: jest.fn(),
    };

    const { container } = renderWithProviders(
      <PaymentAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        isLoading: false,
        error: 'Payment action failed',
      },
    };

    const mockProps = {
      steps: [
        { title: <span>Step 1</span> },
        { title: <span>Step 2</span> },
        { title: <span>Step 3</span> },
      ],
      onValidateFields: jest.fn(),
    };

    const { container } = renderWithProviders(
      <PaymentAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
