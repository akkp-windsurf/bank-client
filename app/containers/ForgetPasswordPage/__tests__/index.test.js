import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ForgetPasswordPage from '../index';

describe('<ForgetPasswordPage />', () => {
  it('should render without crashing', () => {
    const initialState = {
      forgetPasswordPage: {
        isLoading: false,
        error: null,
        isSuccess: false,
      },
    };

    const { container } = renderWithProviders(<ForgetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const initialState = {
      forgetPasswordPage: {
        isLoading: true,
        error: null,
        isSuccess: false,
      },
    };

    const { container } = renderWithProviders(<ForgetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render success state', () => {
    const initialState = {
      forgetPasswordPage: {
        isLoading: false,
        error: null,
        isSuccess: true,
      },
    };

    const { container } = renderWithProviders(<ForgetPasswordPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
