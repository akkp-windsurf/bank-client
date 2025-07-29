# Onboarding Guide - Bank Client

Welcome to the Bank Client development team! This comprehensive guide will help you get up to speed with our banking application frontend, understand the codebase, and become a productive team member.

## 📋 Table of Contents

- [Welcome to Banking Software Development](#welcome-to-banking-software-development)
- [Getting Started](#getting-started)
- [Understanding the Banking Domain](#understanding-the-banking-domain)
- [Codebase Architecture](#codebase-architecture)
- [Development Environment Setup](#development-environment-setup)
- [Security and Compliance Training](#security-and-compliance-training)
- [Development Workflow](#development-workflow)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Banking-Specific Guidelines](#banking-specific-guidelines)
- [Resources and Learning Materials](#resources-and-learning-materials)
- [Your First Tasks](#your-first-tasks)

## 🏦 Welcome to Banking Software Development

### What Makes Banking Software Special

Banking applications are fundamentally different from typical web applications due to:

- **Financial Precision**: Every calculation must be exact to the penny
- **Security Requirements**: Handling sensitive financial data requires the highest security standards
- **Regulatory Compliance**: Must adhere to strict financial regulations (PCI DSS, GDPR, etc.)
- **Audit Requirements**: Every action must be logged and traceable
- **High Availability**: Banking systems must be available 24/7
- **Data Integrity**: Financial data must never be corrupted or lost

### Our Application Overview

The Bank Client is a React-based frontend application that provides:

- **Account Management**: View balances, account details, and statements
- **Transaction Processing**: Send payments, transfer funds, and manage transactions
- **Multi-Currency Support**: Handle multiple currencies with real-time exchange rates
- **Security Features**: JWT authentication, input validation, and audit logging
- **Internationalization**: Support for multiple languages and locales
- **Progressive Web App**: Mobile-responsive design with offline capabilities

## 🚀 Getting Started

### Day 1: Environment Setup

#### 1. System Requirements Check
```bash
# Verify Node.js version (16.14.0+)
node --version

# Verify Yarn version (1.22.0+)
yarn --version

# Verify Git configuration
git config --list
```

#### 2. Repository Access
```bash
# Clone the repository
git clone https://github.com/akkp-windsurf/bank-client.git
cd bank-client

# Install dependencies
yarn install

# Verify installation
yarn --check-files
```

#### 3. Initial Setup Verification
```bash
# Run tests to ensure everything works
yarn test

# Check code quality
yarn lint

# Start development server
yarn start
```

### Day 2-3: Codebase Exploration

#### Understanding the Project Structure
```
bank-client/
├── app/                    # Application source code
│   ├── components/         # Reusable UI components
│   ├── containers/         # Connected components (pages)
│   ├── helpers/           # Utility functions
│   ├── providers/         # Context providers
│   ├── translations/      # i18n translation files
│   └── utils/            # API configuration and utilities
├── internals/             # Build configuration
│   ├── webpack/          # Webpack configurations
│   ├── scripts/          # Build scripts
│   └── generators/       # Code generators
├── server/               # Development server
└── build/               # Production build output
```

#### Key Files to Understand
1. **`app/utils/api.js`** - API endpoint configuration
2. **`app/app.js`** - Main application entry point
3. **`jest.config.js`** - Testing configuration
4. **`.eslintrc.js`** - Code quality rules
5. **`package.json`** - Dependencies and scripts

### Week 1: Banking Domain Knowledge

#### Core Banking Concepts

##### 1. Account Management
```javascript
// Example: Account structure
const account = {
  id: 'acc_123456',
  accountNumber: '1234567890',
  balance: '5000.00',
  currency: 'USD',
  type: 'checking',
  status: 'active'
};
```

##### 2. Transaction Types
- **Transfer**: Moving money between accounts
- **Payment**: Sending money to external accounts
- **Deposit**: Adding money to an account
- **Withdrawal**: Removing money from an account

##### 3. Financial Precision
```javascript
// Always use Decimal.js for financial calculations
import { Decimal } from 'decimal.js';

const amount = new Decimal('100.50');
const fee = new Decimal('2.50');
const total = amount.plus(fee); // '103.00'
```

##### 4. Currency Handling
```javascript
// Multi-currency support
const formatCurrency = (amount, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

formatCurrency(1234.56, 'USD', 'en-US'); // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
```

## 🏗 Codebase Architecture

### Technology Stack

#### Frontend Technologies
- **React.js**: Component-based UI library
- **Redux**: State management with Redux Toolkit
- **Redux-Saga**: Side effect management for async operations
- **Reselect**: Memoized state selectors
- **Immer**: Immutable state updates
- **Ant Design**: Enterprise-class UI components
- **styled-components**: CSS-in-JS styling solution

#### Development Tools
- **Webpack**: Module bundler with custom configuration
- **Babel**: JavaScript transpilation
- **ESLint**: Code linting with Airbnb configuration
- **Prettier**: Code formatting
- **Jest**: Testing framework with 98% coverage requirement
- **Husky**: Git hooks for pre-commit validation

### Component Architecture

#### Component Hierarchy
```
App
├── Header
│   ├── Navigation
│   ├── UserMenu
│   └── LanguageSelector
├── Main
│   ├── Dashboard
│   │   ├── AccountSummary
│   │   ├── RecentTransactions
│   │   └── QuickActions
│   ├── PaymentForm
│   │   ├── AmountInput
│   │   ├── RecipientSelector
│   │   └── ConfirmationDialog
│   └── TransactionHistory
│       ├── TransactionList
│       ├── TransactionFilter
│       └── Pagination
└── Footer
```

#### Component Patterns

##### 1. Container Components
```javascript
// containers/PaymentPage/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PaymentForm from 'components/PaymentForm';
import { makeSelectUserBalance } from './selectors';
import { loadBalance } from './actions';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { balance } = useSelector(makeSelectPaymentPage());

  useEffect(() => {
    dispatch(loadBalance());
  }, [dispatch]);

  return (
    <div>
      <PaymentForm balance={balance} />
    </div>
  );
};
```

##### 2. Presentational Components
```javascript
// components/PaymentForm/index.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { validateAmount, formatCurrency } from 'utils/currency';

const PaymentForm = ({ balance, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (validateAmount(values.amount)) {
      onSubmit(values);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true, message: 'Amount is required' },
          { validator: (_, value) => validateAmount(value) }
        ]}
      >
        <Input placeholder="Enter amount" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Send Payment
      </Button>
    </Form>
  );
};

PaymentForm.propTypes = {
  balance: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
```

### State Management

#### Redux Store Structure
```javascript
// store structure
{
  auth: {
    user: { id, email, name, accountNumber },
    token: 'jwt_token',
    isAuthenticated: boolean,
    loading: boolean,
    error: null
  },
  transactions: {
    list: [],
    loading: boolean,
    error: null,
    pagination: { page, limit, total }
  },
  accounts: {
    balance: '0.00',
    currency: 'USD',
    loading: boolean,
    error: null
  }
}
```

#### Saga Pattern for Side Effects
```javascript
// sagas/transaction.js
import { call, put, takeEvery } from 'redux-saga/effects';
import { SEND_PAYMENT_REQUEST } from './constants';
import { sendPaymentSuccess, sendPaymentError } from './actions';
import { api } from 'utils/api';

function* sendPaymentSaga(action) {
  try {
    const response = yield call(api.post, '/transactions/create', action.payload);
    yield put(sendPaymentSuccess(response.data));
  } catch (error) {
    yield put(sendPaymentError(error.message));
  }
}

function* transactionSaga() {
  yield takeEvery(SEND_PAYMENT_REQUEST, sendPaymentSaga);
}
```

## 🔐 Security and Compliance Training

### Security Fundamentals

#### 1. Input Validation and Sanitization
```javascript
// utils/security.js
import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const validateAccountNumber = (accountNumber) => {
  const regex = /^\d{10,12}$/;
  return regex.test(accountNumber);
};

export const validateAmount = (amount) => {
  const decimal = new Decimal(amount);
  return decimal.gt(0) && decimal.lte(1000000) && decimal.dp() <= 2;
};
```

#### 2. Authentication and Authorization
```javascript
// utils/auth.js
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token || !isTokenValid(token)) {
    throw new Error('Authentication required');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

#### 3. Data Protection
```javascript
// Never log sensitive data
const logTransaction = (transaction) => {
  console.log('Transaction processed:', {
    id: transaction.id,
    amount: '[REDACTED]',
    account: '[REDACTED]',
    timestamp: transaction.timestamp
  });
};

// Secure data storage
const secureStorage = {
  setItem: (key, value) => {
    const encrypted = btoa(value); // Use proper encryption in production
    sessionStorage.setItem(key, encrypted);
  },
  getItem: (key) => {
    const encrypted = sessionStorage.getItem(key);
    return encrypted ? atob(encrypted) : null;
  }
};
```

### Compliance Requirements

#### GDPR Compliance
- **Data Minimization**: Only collect necessary data
- **Consent Management**: Explicit user consent for data processing
- **Right to Erasure**: Ability to delete user data
- **Data Portability**: Export user data in standard formats

#### PCI DSS Compliance
- **Secure Transmission**: All payment data must be encrypted
- **Access Control**: Restrict access to cardholder data
- **Regular Testing**: Security testing and vulnerability assessments
- **Monitoring**: Log and monitor all access to payment systems

## 🔄 Development Workflow

### Git Workflow

#### Branch Naming Convention
```bash
# Feature branches
feature/JIRA-123-payment-authorization
feature/456-multi-currency-support

# Bug fix branches
bugfix/JIRA-789-currency-conversion-error
bugfix/101-authentication-timeout

# Hotfix branches
hotfix/JIRA-999-security-vulnerability
hotfix/202-critical-payment-bug
```

#### Daily Development Process
```bash
# Start of day
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# During development
yarn test:watch  # Run tests continuously
yarn lint        # Check code quality
yarn start       # Development server

# Before committing
yarn test:coverage  # Ensure 98% coverage
yarn lint          # Fix any linting issues
yarn build         # Verify production build

# Commit and push
git add .
git commit -m "feat: implement payment validation"
git push origin feature/your-feature-name
```

### Code Review Process

#### Review Checklist
- [ ] **Security**: No sensitive data exposed, proper input validation
- [ ] **Banking Logic**: Financial calculations use Decimal.js
- [ ] **Testing**: 98% test coverage maintained
- [ ] **Performance**: No unnecessary re-renders or memory leaks
- [ ] **Accessibility**: WCAG compliance for UI components
- [ ] **Documentation**: Code is self-documenting with clear naming

#### Banking-Specific Review Points
- [ ] All monetary values use Decimal.js for precision
- [ ] Input validation prevents injection attacks
- [ ] Audit logging for sensitive operations
- [ ] Error handling doesn't expose system internals
- [ ] Currency formatting respects user locale

## 🧪 Testing and Quality Assurance

### Testing Strategy

#### Test Coverage Requirements
- **Statements**: 98%
- **Branches**: 91%
- **Functions**: 98%
- **Lines**: 98%

#### Banking-Specific Testing
```javascript
// Example: Financial calculation tests
describe('Currency Conversion', () => {
  it('should maintain precision in calculations', () => {
    const amount = new Decimal('100.50');
    const rate = new Decimal('1.2345');
    const result = convertCurrency(amount, rate);
    
    expect(result.toString()).toBe('124.07');
    expect(result).toBeInstanceOf(Decimal);
  });

  it('should handle edge cases', () => {
    // Test zero amounts
    expect(convertCurrency(new Decimal('0'), new Decimal('1.5')).toString()).toBe('0');
    
    // Test very small amounts
    const smallAmount = new Decimal('0.01');
    const result = convertCurrency(smallAmount, new Decimal('1.5'));
    expect(result.toString()).toBe('0.02');
  });
});
```

#### Security Testing
```javascript
// Example: XSS prevention tests
describe('Input Sanitization', () => {
  it('should prevent XSS attacks', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
  });

  it('should preserve safe content', () => {
    const safeInput = 'Payment for invoice #12345';
    const sanitized = sanitizeInput(safeInput);
    
    expect(sanitized).toBe(safeInput);
  });
});
```

### Quality Assurance Process

#### Pre-commit Hooks
```javascript
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint
yarn test:coverage
yarn build
```

#### Continuous Integration
```yaml
# .github/workflows/ci.yml
name: CI Pipeline
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
      - name: Run tests
        run: yarn test:coverage
      - name: Security audit
        run: yarn audit
      - name: Build application
        run: yarn build
```

## 🏦 Banking-Specific Guidelines

### Financial Data Handling

#### Decimal Precision
```javascript
// ✅ Correct: Use Decimal.js for all financial calculations
import { Decimal } from 'decimal.js';

const calculateTotal = (amount, fee) => {
  const amountDecimal = new Decimal(amount);
  const feeDecimal = new Decimal(fee);
  return amountDecimal.plus(feeDecimal);
};

// ❌ Incorrect: Never use floating point for money
const calculateTotal = (amount, fee) => {
  return amount + fee; // Can cause precision errors
};
```

#### Currency Formatting
```javascript
// ✅ Correct: Use Intl.NumberFormat for currency display
const formatCurrency = (amount, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// ❌ Incorrect: Manual string formatting
const formatCurrency = (amount, currency) => {
  return `${currency} ${amount.toFixed(2)}`; // Doesn't handle locales
};
```

### Security Best Practices

#### Input Validation
```javascript
// ✅ Correct: Comprehensive validation
const validatePaymentData = (data) => {
  const errors = [];

  // Amount validation
  if (!data.amount || !validateAmount(data.amount)) {
    errors.push('Invalid amount');
  }

  // Account validation
  if (!data.recipientAccount || !validateAccountNumber(data.recipientAccount)) {
    errors.push('Invalid recipient account');
  }

  // Sanitize description
  data.description = sanitizeInput(data.description);

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: data
  };
};
```

#### Error Handling
```javascript
// ✅ Correct: Don't expose system details
const handleApiError = (error) => {
  console.error('API Error:', error); // Log for debugging
  
  // Return user-friendly message
  if (error.status === 400) {
    return 'Invalid request. Please check your input.';
  } else if (error.status === 401) {
    return 'Authentication required. Please log in.';
  } else {
    return 'An error occurred. Please try again later.';
  }
};

// ❌ Incorrect: Exposing system details
const handleApiError = (error) => {
  return error.message; // Could expose sensitive information
};
```

### Audit and Compliance

#### Audit Logging
```javascript
// utils/audit.js
export const logUserAction = (action, userId, details) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    sessionId: getSessionId(),
    ipAddress: getUserIP(),
    userAgent: navigator.userAgent,
    details: sanitizeAuditData(details)
  };

  // Send to audit service
  sendAuditLog(auditEntry);
};

// Usage
logUserAction('PAYMENT_INITIATED', userId, {
  amount: '[REDACTED]',
  recipientAccount: '[REDACTED]',
  transactionId: transaction.id
});
```

## 📚 Resources and Learning Materials

### Internal Documentation
- [Coding Standards](./CODING_STANDARDS.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Debugging Guide](./DEBUGGING.md)
- [Testing Guide](./TESTING.md)

### External Resources

#### React and Redux
- [React Documentation](https://reactjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux-Saga](https://redux-saga.js.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

#### Banking and Finance
- [PCI DSS Guidelines](https://www.pcisecuritystandards.org/)
- [GDPR Compliance](https://gdpr.eu/)
- [Financial Regulations](https://www.bis.org/)
- [ISO 20022 Standards](https://www.iso20022.org/)

#### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Learning Path

#### Week 1: Foundation
- [ ] Complete environment setup
- [ ] Read all internal documentation
- [ ] Understand banking domain concepts
- [ ] Review codebase architecture

#### Week 2: Development Skills
- [ ] Complete first bug fix
- [ ] Write comprehensive tests
- [ ] Participate in code reviews
- [ ] Learn debugging techniques

#### Week 3: Banking Expertise
- [ ] Implement financial calculation feature
- [ ] Add security validation
- [ ] Create audit logging
- [ ] Handle currency conversion

#### Week 4: Advanced Topics
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Internationalization
- [ ] Production deployment

## 🎯 Your First Tasks

### Task 1: Environment Verification (Day 1)
```bash
# Clone and setup
git clone https://github.com/akkp-windsurf/bank-client.git
cd bank-client
yarn install

# Verify everything works
yarn test
yarn lint
yarn build
yarn start
```

**Success Criteria**: All commands complete without errors

### Task 2: Code Exploration (Day 2-3)
1. **Read the codebase**:
   - Explore `app/` directory structure
   - Understand component hierarchy
   - Review API configuration in `app/utils/api.js`

2. **Run the application**:
   - Start development server
   - Navigate through all pages
   - Test payment form validation
   - Check responsive design

**Success Criteria**: Can navigate the application and understand its structure

### Task 3: First Bug Fix (Week 1)
Find and fix a simple bug in the codebase:
1. Look for TODO comments or known issues
2. Write a test that reproduces the bug
3. Fix the bug
4. Ensure all tests pass
5. Create a pull request

**Success Criteria**: Successfully complete the bug fix workflow

### Task 4: Feature Implementation (Week 2)
Implement a small feature:
1. Add input validation for a form field
2. Write comprehensive tests (unit + integration)
3. Add proper error handling
4. Include audit logging
5. Update documentation

**Success Criteria**: Feature meets all banking security requirements

### Task 5: Security Review (Week 3)
Conduct a security review of an existing component:
1. Check for XSS vulnerabilities
2. Verify input sanitization
3. Review error handling
4. Test authentication flows
5. Document findings and improvements

**Success Criteria**: Identify and fix at least one security issue

### Getting Help

#### Team Contacts
- **Tech Lead**: For architecture and design decisions
- **Security Team**: For security-related questions
- **DevOps**: For deployment and infrastructure issues
- **QA Team**: For testing strategies and requirements

#### Communication Channels
- **Daily Standups**: 9:00 AM EST
- **Code Reviews**: GitHub pull requests
- **Technical Discussions**: Team Slack channel
- **Documentation**: Internal wiki and GitHub

#### Escalation Process
1. **Self-service**: Check documentation and troubleshooting guides
2. **Peer help**: Ask team members in Slack
3. **Tech lead**: For complex technical issues
4. **Manager**: For process or priority questions

### Success Metrics

#### 30-Day Goals
- [ ] Complete all onboarding tasks
- [ ] Contribute to 3 pull requests
- [ ] Pass security training assessment
- [ ] Understand banking domain concepts
- [ ] Achieve 98% test coverage on contributions

#### 60-Day Goals
- [ ] Lead a small feature implementation
- [ ] Mentor a new team member
- [ ] Contribute to documentation improvements
- [ ] Participate in architecture discussions
- [ ] Complete advanced security training

#### 90-Day Goals
- [ ] Own a major feature area
- [ ] Contribute to technical decisions
- [ ] Present at team knowledge sharing
- [ ] Identify and implement process improvements
- [ ] Become a code review expert

Welcome to the team! We're excited to have you contribute to building secure, reliable banking software. Remember, in banking software, precision and security are paramount. When in doubt, always err on the side of caution and ask for help.

Happy coding! 🚀
