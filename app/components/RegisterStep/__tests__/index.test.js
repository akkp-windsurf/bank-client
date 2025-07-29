import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import RegisterStep from '../index';

describe('<RegisterStep />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      register: {
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
      <RegisterStep steps={mockSteps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different step', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      register: {
        currentStep: 2,
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
      <RegisterStep steps={mockSteps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    const initialState = {
      global: {
        user: { name: 'Test User' },
        isLogged: false,
      },
      register: {
        currentStep: 1,
        totalSteps: 3,
        isLoading: true,
      },
    };

    const mockSteps = [
      { title: <span>Step 1</span> },
      { title: <span>Step 2</span> },
      { title: <span>Step 3</span> },
    ];

    const { container } = renderWithProviders(
      <RegisterStep steps={mockSteps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
