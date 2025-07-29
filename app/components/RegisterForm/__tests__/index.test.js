import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import RegisterForm from '../index';

const mockStore = configureStore([]);

const defaultProps = {
  step: 1,
  isLoading: false,
  errorMessage: '',
  isRegistered: false,
  firstName: '',
  lastName: '',
  password: '',
  email: '',
  currency: 'USD',
};

const renderWithProviders = (component, initialState = {}) => {
  const store = mockStore({
    registerPage: {
      step: 1,
      isLoading: false,
      errorMessage: '',
      isRegistered: false,
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      currency: 'USD',
      ...initialState,
    },
  });

  return render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <BrowserRouter>{component}</BrowserRouter>
      </IntlProvider>
    </Provider>,
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Multi-step Navigation', () => {
    it('should render step 1 by default', () => {
      renderWithProviders(<RegisterForm {...defaultProps} />);

      expect(screen.getByTestId('register-step-1')).toBeInTheDocument();
    });

    it('should navigate to next step with valid input', async () => {
      const store = mockStore({
        registerPage: { ...defaultProps, step: 1 },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <RegisterForm {...defaultProps} />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const firstNameInput = screen.getByTestId('first-name-input');
      const lastNameInput = screen.getByTestId('last-name-input');
      const nextButton = screen.getByRole('button', { name: /next/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.click(nextButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: expect.stringContaining('CHANGE_STEP'),
          }),
        );
      });
    });

    it('should render step 2 when step prop is 2', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      expect(screen.getByTestId('register-step-2')).toBeInTheDocument();
    });

    it('should render step 3 when step prop is 3', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={3} />);

      expect(screen.getByTestId('register-step-3')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate first name is required', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={1} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });

    it('should validate last name is required', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={1} />);

      const firstNameInput = screen.getByTestId('first-name-input');
      const nextButton = screen.getByRole('button', { name: /next/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.click(nextButton);

      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });

    it('should validate name format', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={1} />);

      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: 'John123' } });

      expect(screen.getByText(/invalid name format/i)).toBeInTheDocument();
    });

    it('should validate email format', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('should validate password requirements', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      const passwordInput = screen.getByTestId('password-input');
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);

      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeInTheDocument();
    });

    it('should validate currency selection', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={3} />);

      const registerButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(registerButton);

      expect(screen.getByText(/currency is required/i)).toBeInTheDocument();
    });
  });

  describe('Field Input Handling', () => {
    it('should handle first name input changes', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={1} />);

      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      expect(firstNameInput.value).toBe('John');
    });

    it('should handle last name input changes', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={1} />);

      const lastNameInput = screen.getByTestId('last-name-input');
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

      expect(lastNameInput.value).toBe('Doe');
    });

    it('should handle email input changes', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(emailInput.value).toBe('john@example.com');
    });

    it('should handle password input changes', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      const passwordInput = screen.getByTestId('password-input');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('should handle currency selection changes', () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={3} />);

      const currencySelect = screen.getByTestId('currency-select');
      fireEvent.change(currencySelect, { target: { value: 'EUR' } });

      expect(currencySelect.value).toBe('EUR');
    });
  });

  describe('Redux Integration', () => {
    it('should dispatch register action on form submission', async () => {
      const store = mockStore({
        registerPage: {
          ...defaultProps,
          step: 3,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          currency: 'USD',
        },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <RegisterForm {...defaultProps} step={3} />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const registerButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(registerButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: expect.stringContaining('REGISTER'),
          }),
        );
      });
    });

    it('should dispatch change step action', async () => {
      const store = mockStore({
        registerPage: { ...defaultProps, step: 1 },
      });

      render(
        <Provider store={store}>
          <IntlProvider locale="en">
            <BrowserRouter>
              <RegisterForm {...defaultProps} step={1} />
            </BrowserRouter>
          </IntlProvider>
        </Provider>,
      );

      const firstNameInput = screen.getByTestId('first-name-input');
      const lastNameInput = screen.getByTestId('last-name-input');
      const nextButton = screen.getByRole('button', { name: /next/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.click(nextButton);

      await waitFor(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual(
          expect.objectContaining({
            type: expect.stringContaining('CHANGE_STEP'),
          }),
        );
      });
    });
  });

  describe('Success State', () => {
    it('should show success message when registration is complete', () => {
      renderWithProviders(<RegisterForm {...defaultProps} isRegistered />);

      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });

    it('should hide form when registration is successful', () => {
      renderWithProviders(<RegisterForm {...defaultProps} isRegistered />);

      expect(screen.queryByTestId('register-step-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('register-step-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('register-step-3')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when present', () => {
      renderWithProviders(
        <RegisterForm {...defaultProps} errorMessage="Registration failed" />,
      );

      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });

    it('should disable submit button when loading', () => {
      renderWithProviders(<RegisterForm {...defaultProps} isLoading />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Async Email Validation', () => {
    it('should validate email uniqueness', async () => {
      renderWithProviders(<RegisterForm {...defaultProps} step={2} />);

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, {
        target: { value: 'existing@example.com' },
      });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });
});
