# Testing Guide - Bank Client

This comprehensive guide covers testing strategies, procedures, and requirements for the Bank Client frontend application with a focus on banking-specific scenarios and security testing.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Setup](#testing-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Banking-Specific Testing](#banking-specific-testing)
- [Security Testing](#security-testing)
- [Performance Testing](#performance-testing)
- [Coverage Requirements](#coverage-requirements)
- [Testing Best Practices](#testing-best-practices)

## 🎯 Testing Philosophy

### Banking Application Testing Principles

1. **Financial Accuracy** - All monetary calculations must be precise
2. **Security First** - Every feature must be tested for security vulnerabilities
3. **Compliance** - Tests must verify regulatory compliance requirements
4. **User Safety** - Prevent any actions that could harm user accounts
5. **Data Integrity** - Ensure all financial data remains consistent

### Test Pyramid Structure

```
    /\
   /  \     E2E Tests (10%)
  /____\    - Critical user journeys
 /      \   - Cross-browser testing
/________\  Integration Tests (20%)
           - Component interactions
           - API integration
___________
           Unit Tests (70%)
           - Individual functions
           - Component logic
           - Utility functions
```

## 🔧 Testing Setup

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/*/RbGenerated*/*.{js,jsx}',
    '!app/app.js',
    '!app/global-styles.js',
    '!app/*/*/Loadable.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleDirectories: ['node_modules', 'app'],
  moduleNameMapping: {
    '.*\\.(css|less|styl|scss|sass)$': 'identity-obj-proxy',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: ['<rootDir>/internals/testing/test-bundler.js'],
  testRegex: 'tests/.*\\.test\\.js$',
  snapshotSerializers: [],
};
```

### Test Utilities Setup

```javascript
// internals/testing/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import theme from 'utils/theme';
import { DEFAULT_LOCALE } from 'i18n';

// Mock store factory
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth || {}, action) => state,
      transactions: (state = initialState.transactions || {}, action) => state,
    },
    preloadedState: initialState,
  });
};

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    initialState = {},
    store = createMockStore(initialState),
    route = '/',
    locale = DEFAULT_LOCALE,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <IntlProvider locale={locale} messages={{}}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Banking-specific test utilities
export const createMockTransaction = (overrides = {}) => ({
  id: 'txn_123456',
  amount: '100.50',
  currency: 'USD',
  senderAccount: '1234567890',
  recipientAccount: '0987654321',
  description: 'Test transaction',
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  accountNumber: '1234567890',
  balance: '5000.00',
  currency: 'USD',
  ...overrides,
});
```

## 🧪 Unit Testing

### Component Testing

```javascript
// components/PaymentForm/__tests__/index.test.js
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, createMockUser } from 'internals/testing/test-utils';
import PaymentForm from '../index';

describe('<PaymentForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Validation', () => {
    it('should validate payment amount correctly', async () => {
      const mockOnSubmit = jest.fn();
      renderWithProviders(<PaymentForm onSubmit={mockOnSubmit} />);

      const amountInput = screen.getByLabelText(/amount/i);
      const submitButton = screen.getByRole('button', { name: /send payment/i });

      fireEvent.change(amountInput, { target: { value: '-100' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate account number format', async () => {
      const mockOnSubmit = jest.fn();
      renderWithProviders(<PaymentForm onSubmit={mockOnSubmit} />);

      const accountInput = screen.getByLabelText(/recipient account/i);
      const submitButton = screen.getByRole('button', { name: /send payment/i });

      fireEvent.change(accountInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid account number format/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate sufficient balance', async () => {
      const store = createMockStore({
        auth: { user: { id: '123', balance: '100.00' } }
      });
      
      const mockOnSubmit = jest.fn();
      renderWithProviders(<PaymentForm onSubmit={mockOnSubmit} />, { store });

      const amountInput = screen.getByLabelText(/amount/i);
      const accountInput = screen.getByLabelText(/recipient account/i);
      const submitButton = screen.getByRole('button', { name: /send payment/i });

      fireEvent.change(amountInput, { target: { value: '200.00' } });
      fireEvent.change(accountInput, { target: { value: '1234567890' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Banking-Specific Functionality', () => {
    it('should handle decimal precision correctly', () => {
      const mockOnSubmit = jest.fn();
      renderWithProviders(<PaymentForm onSubmit={mockOnSubmit} />);

      const amountInput = screen.getByLabelText(/amount/i);
      
      fireEvent.change(amountInput, { target: { value: '100.123' } });
      
      expect(amountInput.value).toBe('100.12');
    });

    it('should format currency display correctly', () => {
      renderWithProviders(<PaymentForm />);

      const balanceDisplay = screen.getByTestId('current-balance');
      expect(balanceDisplay).toHaveTextContent('$1,000.00');
    });
  });

  describe('Security Features', () => {
    it('should sanitize input values', () => {
      const mockOnSubmit = jest.fn();
      renderWithProviders(<PaymentForm onSubmit={mockOnSubmit} />);

      const descriptionInput = screen.getByLabelText(/description/i);
      
      fireEvent.change(descriptionInput, { 
        target: { value: '<script>alert("xss")</script>' } 
      });
      
      expect(descriptionInput.value).not.toContain('<script>');
    });

    it('should not expose sensitive data in DOM', () => {
      renderWithProviders(<PaymentForm />);

      const formElement = screen.getByRole('form');
      expect(formElement.innerHTML).not.toContain('token');
      expect(formElement.innerHTML).not.toContain('password');
    });
  });
});
```

### Utility Function Testing

```javascript
// utils/__tests__/currency.test.js
import { Decimal } from 'decimal.js';
import {
  convertCurrency,
  formatCurrency,
  validateAmount,
  calculateTransactionFee
} from '../currency';

describe('Currency Utilities', () => {
  describe('convertCurrency', () => {
    it('should convert currency with correct precision', () => {
      const amount = new Decimal('100.50');
      const rate = new Decimal('1.2345');
      const result = convertCurrency(amount, rate);

      expect(result.toString()).toBe('124.07');
      expect(result).toBeInstanceOf(Decimal);
    });

    it('should handle edge cases', () => {
      expect(convertCurrency(new Decimal('0'), new Decimal('1.5')).toString()).toBe('0');
      
      const smallAmount = new Decimal('0.01');
      const result = convertCurrency(smallAmount, new Decimal('1.5'));
      expect(result.toString()).toBe('0.02');
    });

    it('should maintain precision for large amounts', () => {
      const largeAmount = new Decimal('999999.99');
      const rate = new Decimal('1.234567');
      const result = convertCurrency(largeAmount, rate);
      
      expect(result.dp()).toBeLessThanOrEqual(2);
      expect(result.toString()).toBe('1234566.65');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56');
      expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00');
      expect(formatCurrency(0.01, 'USD', 'en-US')).toBe('$0.01');
    });

    it('should format EUR correctly', () => {
      expect(formatCurrency(1234.56, 'EUR', 'en-US')).toBe('€1,234.56');
    });

    it('should handle different locales', () => {
      expect(formatCurrency(1234.56, 'USD', 'de-DE')).toBe('1.234,56 $');
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      expect(validateAmount('100.50')).toBe(true);
      expect(validateAmount('0.01')).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount('0')).toBe(false);
      expect(validateAmount('-100')).toBe(false);
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('')).toBe(false);
    });

    it('should validate decimal precision', () => {
      expect(validateAmount('100.12')).toBe(true);
      expect(validateAmount('100.123')).toBe(false);
    });
  });

  describe('calculateTransactionFee', () => {
    it('should calculate fees correctly', () => {
      const amount = new Decimal('1000');
      const feeRate = new Decimal('0.025');
      const fee = calculateTransactionFee(amount, feeRate);

      expect(fee.toString()).toBe('25.00');
    });

    it('should apply minimum fee', () => {
      const amount = new Decimal('1');
      const feeRate = new Decimal('0.025');
      const minFee = new Decimal('1.00');
      const fee = calculateTransactionFee(amount, feeRate, minFee);

      expect(fee.toString()).toBe('1.00');
    });

    it('should apply maximum fee', () => {
      const amount = new Decimal('100000');
      const feeRate = new Decimal('0.025');
      const minFee = new Decimal('1.00');
      const maxFee = new Decimal('100.00');
      const fee = calculateTransactionFee(amount, feeRate, minFee, maxFee);

      expect(fee.toString()).toBe('100.00');
    });
  });
});
```

## 🔗 Integration Testing

### Component Integration Tests

```javascript
// containers/PaymentPage/__tests__/integration.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PaymentPage from '../index';
import { createTestStore } from '../../../internals/testing/store';

const server = setupServer(
  rest.post('/bank/transactions/create', (req, res, ctx) => {
    const { amount, recipientAccount } = req.body;
    
    if (amount > 1000) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Amount exceeds daily limit' })
      );
    }
    
    return res(
      ctx.json({
        id: 'txn_123',
        status: 'pending',
        amount,
        recipientAccount,
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.get('/bank/accounts/balance', (req, res, ctx) => {
    return res(
      ctx.json({
        balance: '5000.00',
        currency: 'USD'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderPaymentPage = (initialState = {}) => {
  const store = createTestStore(initialState);
  
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <IntlProvider locale="en" messages={{}}>
          <PaymentPage />
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('PaymentPage Integration', () => {
  it('should complete a successful payment flow', async () => {
    renderPaymentPage({
      auth: {
        user: { id: '123', token: 'valid-token' },
        isAuthenticated: true
      }
    });

    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100.00' }
    });
    
    fireEvent.change(screen.getByLabelText(/recipient account/i), {
      target: { value: '9876543210' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test payment' }
    });

    fireEvent.click(screen.getByRole('button', { name: /send payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/payment sent successfully/i)).toBeInTheDocument();
    });

    expect(screen.getByText('txn_123')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('should handle payment errors gracefully', async () => {
    renderPaymentPage({
      auth: {
        user: { id: '123', token: 'valid-token' },
        isAuthenticated: true
      }
    });

    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '1500.00' }
    });
    
    fireEvent.change(screen.getByLabelText(/recipient account/i), {
      target: { value: '9876543210' }
    });

    fireEvent.click(screen.getByRole('button', { name: /send payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount exceeds daily limit/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it('should validate authentication before allowing payments', async () => {
    renderPaymentPage({
      auth: {
        user: null,
        isAuthenticated: false
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
    });
  });
});
```

## 🎭 End-to-End Testing

### E2E Test Setup with Cypress

```javascript
// cypress/support/commands.js
import { Decimal } from 'decimal.js';

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('makePayment', (amount, recipientAccount, description) => {
  cy.visit('/payment');
  cy.get('[data-testid="amount-input"]').type(amount);
  cy.get('[data-testid="recipient-input"]').type(recipientAccount);
  cy.get('[data-testid="description-input"]').type(description);
  cy.get('[data-testid="send-payment-button"]').click();
});

Cypress.Commands.add('verifyBalance', (expectedBalance) => {
  cy.get('[data-testid="account-balance"]').should('contain', expectedBalance);
});

Cypress.Commands.add('verifyTransactionInHistory', (transactionId) => {
  cy.visit('/transactions');
  cy.get('[data-testid="transaction-list"]').should('contain', transactionId);
});
```

### E2E Test Scenarios

```javascript
// cypress/e2e/payment-flow.cy.js
describe('Payment Flow E2E', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login('test@example.com', 'password123');
  });

  it('should complete a full payment transaction', () => {
    cy.verifyBalance('$5,000.00');

    cy.makePayment('250.00', '9876543210', 'E2E test payment');

    cy.get('[data-testid="payment-success"]').should('be.visible');
    cy.get('[data-testid="transaction-id"]').should('exist');

    cy.verifyBalance('$4,750.00');

    cy.get('[data-testid="transaction-id"]').then(($el) => {
      const transactionId = $el.text();
      cy.verifyTransactionInHistory(transactionId);
    });
  });

  it('should handle insufficient funds scenario', () => {
    cy.makePayment('10000.00', '9876543210', 'Large payment test');

    cy.get('[data-testid="error-message"]')
      .should('contain', 'Insufficient funds');

    cy.verifyBalance('$5,000.00');
  });

  it('should validate payment form inputs', () => {
    cy.visit('/payment');

    cy.get('[data-testid="amount-input"]').type('-100');
    cy.get('[data-testid="send-payment-button"]').click();
    cy.get('[data-testid="amount-error"]')
      .should('contain', 'Amount must be positive');

    cy.get('[data-testid="amount-input"]').clear().type('100.00');
    cy.get('[data-testid="recipient-input"]').type('123');
    cy.get('[data-testid="send-payment-button"]').click();
    cy.get('[data-testid="recipient-error"]')
      .should('contain', 'Invalid account number');
  });

  it('should handle session timeout during payment', () => {
    cy.visit('/payment');
    cy.get('[data-testid="amount-input"]').type('100.00');
    cy.get('[data-testid="recipient-input"]').type('9876543210');

    cy.window().then((win) => {
      win.localStorage.removeItem('authToken');
    });

    cy.get('[data-testid="send-payment-button"]').click();

    cy.url().should('include', '/login');
    cy.get('[data-testid="session-expired-message"]').should('be.visible');
  });
});
```

## 🏦 Banking-Specific Testing

### Financial Calculation Tests

```javascript
// __tests__/banking/calculations.test.js
import { Decimal } from 'decimal.js';
import {
  calculateCompoundInterest,
  calculateLoanPayment,
  calculateExchangeRate,
  validateIBAN
} from '../../utils/banking';

describe('Banking Calculations', () => {
  describe('Compound Interest', () => {
    it('should calculate compound interest correctly', () => {
      const principal = new Decimal('10000');
      const rate = new Decimal('0.05');
      const time = new Decimal('2');
      const compoundingFrequency = new Decimal('12');

      const result = calculateCompoundInterest(principal, rate, time, compoundingFrequency);
      
      expect(result.toFixed(2)).toBe('11051.62');
    });

    it('should handle edge cases', () => {
      expect(calculateCompoundInterest(new Decimal('0'), new Decimal('0.05'), new Decimal('1'), new Decimal('12')).toString()).toBe('0');
      
      expect(calculateCompoundInterest(new Decimal('1000'), new Decimal('0'), new Decimal('1'), new Decimal('12')).toString()).toBe('1000');
      
      expect(calculateCompoundInterest(new Decimal('1000'), new Decimal('0.05'), new Decimal('0'), new Decimal('12')).toString()).toBe('1000');
    });
  });

  describe('Loan Payment Calculation', () => {
    it('should calculate monthly loan payment correctly', () => {
      const principal = new Decimal('200000');
      const annualRate = new Decimal('0.045');
      const years = new Decimal('30');

      const monthlyPayment = calculateLoanPayment(principal, annualRate, years);
      
      expect(monthlyPayment.toFixed(2)).toBe('1013.37');
    });
  });

  describe('Exchange Rate Calculations', () => {
    it('should calculate cross rates correctly', () => {
      const usdToEur = new Decimal('0.85');
      const usdToGbp = new Decimal('0.73');
      
      const eurToGbp = calculateExchangeRate(usdToEur, usdToGbp);
      
      expect(eurToGbp.toFixed(4)).toBe('0.8588');
    });
  });

  describe('IBAN Validation', () => {
    it('should validate correct IBAN formats', () => {
      const validIBANs = [
        'GB82WEST12345698765432',
        'DE89370400440532013000',
        'FR1420041010050500013M02606'
      ];

      validIBANs.forEach(iban => {
        expect(validateIBAN(iban)).toBe(true);
      });
    });

    it('should reject invalid IBAN formats', () => {
      const invalidIBANs = [
        'GB82WEST1234569876543',
        'XX82WEST12345698765432',
        'GB82WEST12345698765433',
        ''
      ];

      invalidIBANs.forEach(iban => {
        expect(validateIBAN(iban)).toBe(false);
      });
    });
  });
});
```

### Transaction Processing Tests

```javascript
// __tests__/banking/transactions.test.js
import { processTransaction, validateTransaction } from '../../utils/transactions';

describe('Transaction Processing', () => {
  const mockTransaction = {
    id: 'txn_123',
    amount: '100.50',
    currency: 'USD',
    senderAccount: '1234567890',
    recipientAccount: '0987654321',
    type: 'transfer',
    description: 'Test payment'
  };

  describe('Transaction Validation', () => {
    it('should validate correct transaction data', () => {
      const result = validateTransaction(mockTransaction);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid amounts', () => {
      const invalidTransaction = {
        ...mockTransaction,
        amount: '-50.00'
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be positive');
    });

    it('should detect same account transfers', () => {
      const invalidTransaction = {
        ...mockTransaction,
        recipientAccount: mockTransaction.senderAccount
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cannot transfer to same account');
    });

    it('should validate account number formats', () => {
      const invalidTransaction = {
        ...mockTransaction,
        senderAccount: '123'
      };

      const result = validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid sender account format');
    });
  });

  describe('Transaction Processing', () => {
    it('should process valid transactions', async () => {
      const mockApiCall = jest.fn().mockResolvedValue({
        id: 'txn_123',
        status: 'completed',
        timestamp: new Date().toISOString()
      });

      const result = await processTransaction(mockTransaction, mockApiCall);
      
      expect(result.success).toBe(true);
      expect(result.transaction.status).toBe('completed');
      expect(mockApiCall).toHaveBeenCalledWith('/transactions/create', mockTransaction);
    });

    it('should handle processing errors', async () => {
      const mockApiCall = jest.fn().mockRejectedValue(new Error('Insufficient funds'));

      const result = await processTransaction(mockTransaction, mockApiCall);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient funds');
    });
  });
});
```

## 🔒 Security Testing

### Authentication Security Tests

```javascript
// __tests__/security/auth.test.js
import { validatePassword, sanitizeInput, checkTokenExpiry } from '../../utils/security';

describe('Authentication Security', () => {
  describe('Password Validation', () => {
    it('should enforce strong password requirements', () => {
      const weakPasswords = [
        'password',
        '12345678',
        'Password',
        'password123'
      ];

      weakPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should accept strong passwords', () => {
      const strongPasswords = [
        'MyStr0ng!Password',
        'C0mpl3x@Pass#2023',
        'Secure$Banking!123'
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize XSS attempts', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">'
      ];

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
      });
    });

    it('should preserve safe content', () => {
      const safeInputs = [
        'Regular payment description',
        'Payment for invoice #12345',
        'Monthly rent payment'
      ];

      safeInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe(input);
      });
    });
  });

  describe('Token Security', () => {
    it('should detect expired tokens', () => {
      const expiredToken = {
        exp: Math.floor(Date.now() / 1000) - 3600
      };

      expect(checkTokenExpiry(expiredToken)).toBe(false);
    });

    it('should accept valid tokens', () => {
      const validToken = {
        exp: Math.floor(Date.now() / 1000) + 3600
      };

      expect(checkTokenExpiry(validToken)).toBe(true);
    });
  });
});
```

## ⚡ Performance Testing

### Component Performance Tests

```javascript
// __tests__/performance/components.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { renderWithProviders } from 'internals/testing/test-utils';
import TransactionList from '../../components/TransactionList';

describe('Component Performance', () => {
  describe('TransactionList', () => {
    it('should render large transaction lists efficiently', () => {
      const largeTransactionList = Array.from({ length: 1000 }, (_, index) => ({
        id: `txn_${index}`,
        amount: '100.00',
        currency: 'USD',
        description: `Transaction ${index}`,
        createdAt: new Date().toISOString()
      }));

      const startTime = performance.now();
      
      renderWithProviders(
        <TransactionList transactions={largeTransactionList} />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });

    it('should handle frequent updates without performance degradation', () => {
      const { rerender } = renderWithProviders(
        <TransactionList transactions={[]} />
      );

      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        const transactions = Array.from({ length: i }, (_, index) => ({
          id: `txn_${index}`,
          amount: '100.00',
          currency: 'USD',
          description: `Transaction ${index}`,
          createdAt: new Date().toISOString()
        }));

        rerender(<TransactionList transactions={transactions} />);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000);
    });
  });
});
```

## 📊 Coverage Requirements

### Coverage Configuration

```javascript
// jest.config.js - Coverage settings
module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/*/RbGenerated*/*.{js,jsx}',
    '!app/app.js',
    '!app/global-styles.js',
    '!app/*/*/Loadable.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
    './app/utils/': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    './app/components/': {
      statements: 95,
      branches: 85,
      functions: 95,
      lines: 95,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Banking-Specific Coverage Requirements

- **Financial calculations**: 100% coverage required
- **Security functions**: 100% coverage required
- **Authentication logic**: 100% coverage required
- **Transaction processing**: 100% coverage required
- **Input validation**: 100% coverage required

## 📋 Testing Best Practices

### General Testing Guidelines

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Test user interactions and expected outcomes

2. **Use Descriptive Test Names**
   - Test names should clearly describe the scenario
   - Include expected behavior in the test name

3. **Arrange, Act, Assert Pattern**
   - Arrange: Set up test data and conditions
   - Act: Execute the code being tested
   - Assert: Verify the expected outcome

4. **Test Edge Cases**
   - Test boundary conditions
   - Test error scenarios
   - Test empty states

### Banking-Specific Testing Guidelines

1. **Financial Precision Testing**
   ```javascript
   it('should maintain precision in financial calculations', () => {
     const result = calculateInterest('1000.00', '0.05', '1');
     expect(result).toBe('50.00');
     expect(typeof result).toBe('string');
   });
   ```

2. **Security Testing**
   ```javascript
   it('should prevent XSS in user inputs', () => {
     const maliciousInput = '<script>alert("xss")</script>';
     const sanitized = sanitizeInput(maliciousInput);
     expect(sanitized).not.toContain('<script>');
   });
   ```

3. **Compliance Testing**
   ```javascript
   it('should log all financial transactions for audit', () => {
     const mockLogger = jest.fn();
     processTransaction(transactionData, mockLogger);
     expect(mockLogger).toHaveBeenCalledWith(
       expect.objectContaining({
         type: 'TRANSACTION_PROCESSED',
         transactionId: expect.any(String),
         timestamp: expect.any(String)
       })
     );
   });
   ```

### Test Organization

```
__tests__/
├── components/           # Component tests
│   ├── PaymentForm/
│   ├── TransactionList/
│   └── Dashboard/
├── containers/           # Container tests
│   ├── PaymentPage/
│   ├── DashboardPage/
│   └── TransactionPage/
├── utils/               # Utility function tests
│   ├── currency.test.js
│   ├── validation.test.js
│   └── security.test.js
├── banking/             # Banking-specific tests
│   ├── calculations.test.js
│   ├── transactions.test.js
│   └── compliance.test.js
├── security/            # Security tests
│   ├── auth.test.js
│   ├── xss.test.js
│   └── csrf.test.js
└── performance/         # Performance tests
    ├── components.test.js
    └── calculations.test.js
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test suites
yarn test:unit
yarn test:integration
yarn test:e2e

# Run banking-specific tests
yarn test __tests__/banking/

# Run security tests
yarn test __tests__/security/

# Run performance tests
yarn test __tests__/performance/
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: yarn install
      - name: Run unit tests
        run: yarn test:coverage
      - name: Run security tests
        run: yarn test __tests__/security/
      - name: Run banking tests
        run: yarn test __tests__/banking/
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

This comprehensive testing guide ensures that the Bank Client application maintains the highest standards of quality, security, and reliability required for banking software.
