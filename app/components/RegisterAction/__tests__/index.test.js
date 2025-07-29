import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import RegisterAction from '../index';

describe('<RegisterAction />', () => {
  const mockProps = {
    steps: [
      { title: <span>Step 1</span> },
      { title: <span>Step 2</span> },
      { title: <span>Step 3</span> },
    ],
    onValidateFields: jest.fn(),
  };

  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      register: {
        isLoading: false,
        error: null,
      },
    };

    const { container } = renderWithProviders(
      <RegisterAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle registration loading state', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      register: {
        isLoading: true,
        error: null,
      },
    };

    const { container } = renderWithProviders(
      <RegisterAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle registration error', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      register: {
        isLoading: false,
        error: 'Email already exists',
      },
    };

    const { container } = renderWithProviders(
      <RegisterAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle successful registration', () => {
    const initialState = {
      global: {
        isLogged: false,
        isLoading: false,
      },
      register: {
        isLoading: false,
        error: null,
        success: true,
      },
    };

    const { container } = renderWithProviders(
      <RegisterAction {...mockProps} />,
      { initialState },
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
