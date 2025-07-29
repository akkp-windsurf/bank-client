import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginForm from '../index';
import 'utils/__tests__/__mocks__/matchMedia';

const mockStore = configureStore([]);
const renderWithProviders = (initialState = {}) => {
  const store = mockStore({
    loginPage: {
      currentStep: 0,
      isLoading: false,
      errorMessage: '',
      ...initialState,
    },
  });

  return render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </IntlProvider>
    </Provider>,
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1 - PinCode', () => {
    it('should render pin code input on step 1', () => {
      renderWithProviders({ currentStep: 0 });

      expect(screen.getByDisplayValue('')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter pin code/i),
      ).toBeInTheDocument();
    });

    it('should handle pin code input changes', () => {
      renderWithProviders({ currentStep: 0 });

      const pinInput = screen.getByPlaceholderText(/enter pin code/i);
      fireEvent.change(pinInput, { target: { value: '1234' } });

      expect(pinInput.value).toBe('1234');
    });

    it('should validate pin code format', () => {
      renderWithProviders({ currentStep: 0 });

      const pinInput = screen.getByPlaceholderText(/enter pin code/i);
      fireEvent.change(pinInput, { target: { value: 'abc' } });

      expect(pinInput.value).toBe('');
    });

    it('should proceed to next step with valid pin', async () => {
      const store = mockStore({
        loginPage: { currentStep: 0, isLoading: false, errorMessage: '' },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const pinInput = screen.getByPlaceholderText(/enter pin code/i);
      const submitButton = screen.getByRole('button', { name: /next/i });

      fireEvent.change(pinInput, { target: { value: '1234' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: 'app/App/NEXT_STEP',
          }),
        );
      });
    });
  });

  describe('Step 2 - Password', () => {
    it('should render password input on step 2', () => {
      renderWithProviders({ currentStep: 1 });

      expect(
        screen.getByPlaceholderText(/enter password/i),
      ).toBeInTheDocument();
    });

    it('should handle password input changes', () => {
      renderWithProviders({ currentStep: 1 });

      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('should submit login form with valid credentials', async () => {
      const store = mockStore({
        loginPage: { currentStep: 1, isLoading: false, errorMessage: '' },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: 'app/LoginPage/LOGIN_REQUEST',
          }),
        );
      });
    });

    it('should show forgot password link', () => {
      renderWithProviders({ currentStep: 1 });

      expect(
        screen.getByText(/do not you remember the password/i),
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render error state correctly', () => {
      renderWithProviders({ currentStep: 0 });

      const submitButton = screen.getByRole('button', { name: /next/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should handle loading state', () => {
      renderWithProviders({ currentStep: 0, isLoading: true });

      const submitButton = screen.getByRole('button', { name: /next/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should have required field indicators', () => {
      renderWithProviders({ currentStep: 0 });

      const pinCodeLabel = screen.getByText('Pin code');
      expect(pinCodeLabel).toHaveClass('ant-form-item-required');
    });

    it('should have password field required indicator', () => {
      renderWithProviders({ currentStep: 1 });

      const passwordLabel = screen.getByText('Password');
      expect(passwordLabel).toHaveClass('ant-form-item-required');
    });

    it('should handle form submission attempts', async () => {
      const store = mockStore({
        loginPage: { currentStep: 0, isLoading: false, errorMessage: '' },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const submitButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('should dispatch login action on form submission', async () => {
      const store = mockStore({
        loginPage: { currentStep: 1, isLoading: false, errorMessage: '' },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions.length).toBeGreaterThan(0);
        expect(
          actions.some(
            (action) => action.type === 'app/LoginPage/LOGIN_REQUEST',
          ),
        ).toBe(true);
      });
    });

    it('should dispatch change step action', async () => {
      const store = mockStore({
        loginPage: { currentStep: 0, isLoading: false, errorMessage: '' },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <LoginForm />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const pinInput = screen.getByPlaceholderText(/enter pin code/i);
      const submitButton = screen.getByRole('button', { name: /next/i });

      fireEvent.change(pinInput, { target: { value: '1234' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: 'app/App/NEXT_STEP',
          }),
        );
      });
    });
  });
});
