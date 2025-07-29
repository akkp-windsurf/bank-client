# Coding Standards - Bank Client

This document outlines the coding standards and best practices for the Bank Client frontend application.

## 📋 Table of Contents

- [General Principles](#general-principles)
- [JavaScript/React Standards](#javascriptreact-standards)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Testing Standards](#testing-standards)
- [Banking-Specific Guidelines](#banking-specific-guidelines)
- [Security Best Practices](#security-best-practices)

## 🎯 General Principles

### Code Quality Principles

- **SOLID Principles** - Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion
- **DRY (Don't Repeat Yourself)** - Avoid code duplication
- **KISS (Keep It Simple, Stupid)** - Write simple, readable code
- **YAGNI (You Aren't Gonna Need It)** - Don't implement features until needed

### Code Style

- Use **Airbnb ESLint configuration** as the base
- **Prettier** for consistent code formatting
- **2-space indentation** for all files
- **Semicolons required** at the end of statements
- **Single quotes** for strings (except when avoiding escapes)

## 🔧 JavaScript/React Standards

### ESLint Configuration

The project uses a comprehensive ESLint setup:

```javascript
// .eslintrc.js
module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'redux-saga', 'react', 'react-hooks', 'jsx-a11y'],
  // ... additional configuration
};
```

### Key Rules

- **Arrow functions preferred** for anonymous functions
- **No console.log** in production code (use proper logging)
- **Prefer template literals** over string concatenation
- **React Hooks rules** enforced for functional components
- **Accessibility rules** enforced for inclusive design

### File Naming Conventions

```
components/
├── ComponentName/
│   ├── index.js          # Main component export
│   ├── ComponentName.js  # Component implementation
│   ├── styles.js         # Styled components
│   ├── messages.js       # i18n messages
│   └── __tests__/        # Component tests
```

### Import Organization

```javascript
// 1. Node modules
import React from 'react';
import { connect } from 'react-redux';

// 2. Internal modules (absolute paths)
import { selectUser } from 'containers/App/selectors';
import Button from 'components/Button';

// 3. Relative imports
import './styles.css';
```

## 🏗 Component Architecture

### Component Types

#### 1. Presentational Components

```javascript
// components/Button/index.js
import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from './styles';

const Button = ({ children, onClick, variant, disabled }) => (
  <StyledButton
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    type="button"
  >
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => {},
  variant: 'primary',
  disabled: false,
};

export default Button;
```

#### 2. Container Components

```javascript
// containers/DashboardPage/index.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { loadDashboardData } from './actions';
import { selectDashboardData, selectLoading } from './selectors';
import reducer from './reducer';
import saga from './saga';

const DashboardPage = ({ dashboardData, loading, onLoadData }) => {
  useInjectReducer({ key: 'dashboard', reducer });
  useInjectSaga({ key: 'dashboard', saga });

  useEffect(() => {
    onLoadData();
  }, [onLoadData]);

  // Component implementation
};

const mapStateToProps = createStructuredSelector({
  dashboardData: selectDashboardData(),
  loading: selectLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  onLoadData: () => dispatch(loadDashboardData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
```

### Component Guidelines

- **Single Responsibility** - Each component should have one clear purpose
- **Props Validation** - Always use PropTypes for type checking
- **Default Props** - Provide sensible defaults for optional props
- **Functional Components** - Prefer hooks over class components
- **Memoization** - Use React.memo for expensive components

## 🗄 State Management

### Redux Architecture

#### Actions

```javascript
// containers/PaymentPage/actions.js
import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
} from './constants';

export const createPaymentRequest = (paymentData) => ({
  type: CREATE_PAYMENT_REQUEST,
  payload: paymentData,
});

export const createPaymentSuccess = (payment) => ({
  type: CREATE_PAYMENT_SUCCESS,
  payload: payment,
});

export const createPaymentFailure = (error) => ({
  type: CREATE_PAYMENT_FAILURE,
  payload: error,
});
```

#### Reducers with Immer

```javascript
// containers/PaymentPage/reducer.js
import produce from 'immer';
import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
} from './constants';

export const initialState = {
  loading: false,
  payment: null,
  error: null,
};

const paymentReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CREATE_PAYMENT_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
      case CREATE_PAYMENT_SUCCESS:
        draft.loading = false;
        draft.payment = action.payload;
        break;
      case CREATE_PAYMENT_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;
    }
  });

export default paymentReducer;
```

#### Selectors with Reselect

```javascript
// containers/PaymentPage/selectors.js
import { createSelector } from 'reselect';

const selectPaymentDomain = (state) => state.payment || initialState;

const selectLoading = () =>
  createSelector(selectPaymentDomain, (substate) => substate.loading);

const selectPayment = () =>
  createSelector(selectPaymentDomain, (substate) => substate.payment);

const selectError = () =>
  createSelector(selectPaymentDomain, (substate) => substate.error);

export { selectLoading, selectPayment, selectError };
```

#### Sagas for Side Effects

```javascript
// containers/PaymentPage/saga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { createPaymentSuccess, createPaymentFailure } from './actions';
import { CREATE_PAYMENT_REQUEST } from './constants';
import { apiCall } from 'utils/api';

function* createPayment(action) {
  try {
    const response = yield call(apiCall, {
      method: 'POST',
      url: '/transactions/create',
      data: action.payload,
    });
    yield put(createPaymentSuccess(response.data));
  } catch (error) {
    yield put(createPaymentFailure(error.message));
  }
}

export default function* paymentSaga() {
  yield takeLatest(CREATE_PAYMENT_REQUEST, createPayment);
}
```

## 🎨 Styling Guidelines

### Styled Components

```javascript
// components/Button/styles.js
import styled, { css } from 'styled-components';

export const StyledButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === 'primary' &&
    css`
      background-color: #1890ff;
      color: white;

      &:hover {
        background-color: #40a9ff;
      }
    `}

  ${({ variant }) =>
    variant === 'danger' &&
    css`
      background-color: #ff4d4f;
      color: white;

      &:hover {
        background-color: #ff7875;
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;
```

### Styling Best Practices

- **Consistent spacing** - Use 8px grid system
- **Color variables** - Define colors in theme
- **Responsive design** - Mobile-first approach
- **Accessibility** - Ensure proper contrast ratios
- **Performance** - Avoid inline styles in render

## 🧪 Testing Standards

### Test Structure

```javascript
// components/Button/__tests__/index.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from '../index';

describe('<Button />', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Testing Guidelines

- **98% coverage requirement** - All code must be thoroughly tested
- **Unit tests** - Test individual components and functions
- **Integration tests** - Test component interactions
- **Snapshot tests** - Prevent unintended UI changes
- **Accessibility tests** - Ensure components are accessible

## 🏦 Banking-Specific Guidelines

### Financial Data Handling

```javascript
// utils/currency.js
import { Decimal } from 'decimal.js';

// Always use Decimal for financial calculations
export const calculateAmount = (amount, rate) => {
  const amountDecimal = new Decimal(amount);
  const rateDecimal = new Decimal(rate);
  return amountDecimal.mul(rateDecimal).toFixed(2);
};

// Format currency display
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
```

### Transaction Validation

```javascript
// utils/validation.js
export const validateTransactionAmount = (amount, maxAmount) => {
  const amountNum = parseFloat(amount);
  
  if (isNaN(amountNum) || amountNum <= 0) {
    return 'Amount must be a positive number';
  }
  
  if (amountNum > maxAmount) {
    return 'Amount exceeds available balance';
  }
  
  return null;
};

export const validateAccountNumber = (accountNumber) => {
  const regex = /^\d{10,12}$/;
  return regex.test(accountNumber) ? null : 'Invalid account number format';
};
```

### Internationalization

```javascript
// containers/PaymentPage/messages.js
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.PaymentPage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Make Payment',
  },
  amountLabel: {
    id: `${scope}.amountLabel`,
    defaultMessage: 'Amount',
  },
  recipientLabel: {
    id: `${scope}.recipientLabel`,
    defaultMessage: 'Recipient Account',
  },
});
```

## 🔐 Security Best Practices

### Authentication

```javascript
// utils/auth.js
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return token && !isTokenExpired(token);
};
```

### API Security

```javascript
// utils/api.js
import axios from 'axios';
import { getAuthToken } from './auth';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Input Sanitization

```javascript
// utils/sanitize.js
import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html);
};
```

## 📝 Code Review Checklist

### General Code Quality

- [ ] Code follows ESLint rules
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Code is properly documented
- [ ] No hardcoded values (use constants)

### React/Redux Specific

- [ ] Components have proper PropTypes
- [ ] State updates use Immer for immutability
- [ ] Selectors are memoized with Reselect
- [ ] Side effects handled in Sagas
- [ ] Components are properly tested

### Banking/Security Specific

- [ ] Financial calculations use Decimal.js
- [ ] Input validation implemented
- [ ] Authentication checks in place
- [ ] Sensitive data not logged
- [ ] HTTPS enforced for API calls

### Performance

- [ ] Components memoized where appropriate
- [ ] Large lists virtualized
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Lazy loading implemented

## 🔄 Continuous Improvement

- **Regular code reviews** - All code must be reviewed
- **Refactoring** - Continuously improve code quality
- **Performance monitoring** - Track bundle size and performance
- **Security audits** - Regular security reviews
- **Documentation updates** - Keep documentation current

This coding standards document should be reviewed and updated regularly to reflect best practices and lessons learned from the development process.
