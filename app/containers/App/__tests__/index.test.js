import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import App from '../index';

describe('<App />', () => {
  it('should render without crashing', () => {
    const initialState = {
      global: { isLogged: false, isLoading: false, error: null },
      language: { locale: 'en' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with logged in state', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        error: null,
        user: { name: 'Test User' },
      },
      language: { locale: 'en' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render routes', () => {
    const initialState = {
      global: { isLogged: false, isLoading: false, error: null },
      language: { locale: 'en' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should handle different locales', () => {
    const initialState = {
      global: { isLogged: false, isLoading: false, error: null },
      language: { locale: 'de' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle polish locale', () => {
    const initialState = {
      global: { isLogged: false, isLoading: false, error: null },
      language: { locale: 'pl' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render ConfigProvider with correct locale', () => {
    const initialState = {
      global: { isLogged: false, isLoading: false, error: null },
      language: { locale: 'en' },
    };

    const { container } = renderWithProviders(<App />, { initialState });
    expect(container.querySelector('[class*="ant-"]')).toBeInTheDocument();
  });
});
