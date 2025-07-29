import React from 'react';
import { renderWithProviders } from '../../../../../internals/testing/redux-utils';
import PaymentStep from '../index';

describe('<PaymentStep />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        currentStep: 1,
        totalSteps: 3,
        isLoading: false,
      },
    };

    const mockSteps = [
      { title: <span>Step 1</span> },
      { title: <span>Step 2</span> },
      { title: <span>Step 3</span> },
    ];

    const { container } = renderWithProviders(
      <PaymentStep steps={mockSteps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different step', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: true,
      },
      payment: {
        currentStep: 2,
        totalSteps: 3,
        isLoading: false,
      },
    };

    const mockSteps = [
      { title: <span>Amount</span> },
      { title: <span>Recipient</span> },
      { title: <span>Confirm</span> },
    ];

    const { container } = renderWithProviders(
      <PaymentStep steps={mockSteps} />,
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
        currentStep: 3,
        totalSteps: 3,
        isLoading: true,
      },
    };

    const mockSteps = [
      { title: <span>Amount</span> },
      { title: <span>Recipient</span> },
      { title: <span>Confirm</span> },
    ];

    const { container } = renderWithProviders(
      <PaymentStep steps={mockSteps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
