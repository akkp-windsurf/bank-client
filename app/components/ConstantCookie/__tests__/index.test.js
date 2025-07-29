import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import ConstantCookie from '../index';

describe('<ConstantCookie />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: {
        cookieConsent: false,
        showCookieBanner: true,
      },
    };

    const { container } = renderWithProviders(<ConstantCookie />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with cookie consent given', () => {
    const initialState = {
      global: {
        cookieConsent: true,
        showCookieBanner: false,
      },
    };

    const { container } = renderWithProviders(<ConstantCookie />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle cookie banner visibility', () => {
    const initialState = {
      global: {
        cookieConsent: false,
        showCookieBanner: true,
      },
    };

    const { container } = renderWithProviders(<ConstantCookie />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
