# Debugging Guide - Bank Client

This guide provides comprehensive debugging strategies and procedures specifically tailored for banking application scenarios, security issues, and financial transaction flows.

## 📋 Table of Contents

- [General Debugging Setup](#general-debugging-setup)
- [Banking-Specific Debugging](#banking-specific-debugging)
- [Authentication and Security Issues](#authentication-and-security-issues)
- [Financial Transaction Debugging](#financial-transaction-debugging)
- [Performance Debugging](#performance-debugging)
- [API and Network Issues](#api-and-network-issues)
- [State Management Debugging](#state-management-debugging)
- [Browser-Specific Issues](#browser-specific-issues)
- [Production Debugging](#production-debugging)

## 🔧 General Debugging Setup

### Development Tools Configuration

#### React Developer Tools
```javascript
// Enable React DevTools in development
if (process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = (id, root) => {
    // Custom debugging logic
  };
}
```

#### Redux DevTools Setup
```javascript
// store/configureStore.js
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production' && {
    trace: true,
    traceLimit: 25,
    actionSanitizer: (action) => {
      // Sanitize sensitive data in Redux DevTools
      if (action.type.includes('AUTH') && action.payload) {
        return {
          ...action,
          payload: { ...action.payload, password: '[REDACTED]' }
        };
      }
      return action;
    },
    stateSanitizer: (state) => {
      // Sanitize sensitive state data
      return {
        ...state,
        auth: {
          ...state.auth,
          token: state.auth.token ? '[REDACTED]' : null
        }
      };
    }
  }
});
```

### Logging Configuration

#### Development Logger
```javascript
// utils/logger.js
class BankingLogger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
  }

  logTransaction(transactionData, action) {
    if (this.isDevelopment) {
      console.group(`🏦 Transaction ${action}`);
      console.log('Transaction ID:', transactionData.id);
      console.log('Amount:', this.sanitizeAmount(transactionData.amount));
      console.log('Currency:', transactionData.currency);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  }

  logAuthEvent(event, userId) {
    if (this.isDevelopment) {
      console.group(`🔐 Auth Event: ${event}`);
      console.log('User ID:', userId);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Session ID:', this.getSessionId());
      console.groupEnd();
    }
  }

  logSecurityEvent(event, details) {
    console.warn(`🚨 Security Event: ${event}`, {
      timestamp: new Date().toISOString(),
      details: this.sanitizeSecurityData(details)
    });
  }

  sanitizeAmount(amount) {
    return this.isDevelopment ? amount : '[AMOUNT_REDACTED]';
  }

  sanitizeSecurityData(data) {
    const sanitized = { ...data };
    delete sanitized.token;
    delete sanitized.password;
    delete sanitized.authKey;
    return sanitized;
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }
}

export const logger = new BankingLogger();
```

## 🏦 Banking-Specific Debugging

### Financial Calculation Debugging

#### Decimal Precision Issues
```javascript
// utils/decimal-debug.js
import { Decimal } from 'decimal.js';

export const debugDecimalCalculation = (operation, operands, result) => {
  console.group(`💰 Decimal Calculation Debug: ${operation}`);
  
  operands.forEach((operand, index) => {
    console.log(`Operand ${index + 1}:`, {
      value: operand.toString(),
      type: typeof operand,
      isDecimal: operand instanceof Decimal,
      precision: operand instanceof Decimal ? operand.precision() : 'N/A'
    });
  });
  
  console.log('Result:', {
    value: result.toString(),
    type: typeof result,
    precision: result instanceof Decimal ? result.precision() : 'N/A'
  });
  
  console.log('Calculation Steps:', {
    operation,
    formula: `${operands.map(op => op.toString()).join(` ${operation} `)} = ${result.toString()}`
  });
  
  console.groupEnd();
};
```

### Transaction Flow Debugging

```javascript
// utils/transaction-debug.js
export const debugTransactionFlow = (transactionData) => {
  console.group('🔄 Transaction Flow Debug');
  
  // Validate transaction data
  const validationResults = validateTransactionData(transactionData);
  console.log('Validation Results:', validationResults);
  
  // Check balance sufficiency
  const balanceCheck = checkBalanceSufficiency(transactionData);
  console.log('Balance Check:', balanceCheck);
  
  // Verify authorization
  const authCheck = verifyTransactionAuthorization(transactionData);
  console.log('Authorization Check:', authCheck);
  
  // Log transaction state
  console.log('Transaction State:', {
    id: transactionData.id,
    status: transactionData.status,
    amount: transactionData.amount,
    currency: transactionData.currency,
    sender: transactionData.senderAccount,
    recipient: transactionData.recipientAccount,
    timestamp: new Date().toISOString()
  });
  
  console.groupEnd();
};
```

## 🔐 Authentication and Security Issues

### JWT Token Debugging

```javascript
// utils/auth-debug.js
export const debugJWTToken = (token) => {
  if (!token) {
    console.error('🚨 No JWT token provided');
    return;
  }
  
  console.group('🔐 JWT Token Debug');
  
  try {
    // Decode token (client-side only for debugging)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return;
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('Header:', header);
    console.log('Payload (sanitized):', {
      ...payload,
      // Remove sensitive data
      iat: new Date(payload.iat * 1000).toISOString(),
      exp: new Date(payload.exp * 1000).toISOString(),
      isExpired: payload.exp < Date.now() / 1000
    });
    
    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - now;
    
    console.log('Token Status:', {
      isValid: timeUntilExpiry > 0,
      expiresIn: `${Math.max(0, timeUntilExpiry)} seconds`,
      expiresAt: new Date(payload.exp * 1000).toISOString()
    });
    
  } catch (error) {
    console.error('Error decoding JWT:', error);
  }
  
  console.groupEnd();
};
```

## 💰 Financial Transaction Debugging

### Transaction State Debugging

```javascript
// utils/transaction-state-debug.js
export const debugTransactionState = (transaction) => {
  console.group(`💰 Transaction State Debug: ${transaction.id}`);
  
  console.log('Transaction Details:', {
    id: transaction.id,
    type: transaction.type,
    status: transaction.status,
    amount: transaction.amount,
    currency: transaction.currency,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt
  });
  
  console.log('Parties:', {
    sender: {
      accountId: transaction.senderAccountId,
      name: transaction.senderName,
      balance: transaction.senderBalance
    },
    recipient: {
      accountId: transaction.recipientAccountId,
      name: transaction.recipientName
    }
  });
  
  console.log('Validation Status:', {
    amountValid: validateAmount(transaction.amount),
    balanceSufficient: transaction.senderBalance >= transaction.amount,
    accountsValid: validateAccounts(transaction),
    authorizationValid: transaction.authorizationStatus === 'approved'
  });
  
  console.groupEnd();
};
```

## ⚡ Performance Debugging

### Component Render Debugging

```javascript
// utils/performance-debug.js
import { useEffect, useRef } from 'react';

export const useRenderDebug = (componentName, props) => {
  const renderCount = useRef(0);
  const prevProps = useRef();
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 Render Debug: ${componentName} (${renderCount.current})`);
      
      if (prevProps.current) {
        const changedProps = Object.keys(props).filter(
          key => props[key] !== prevProps.current[key]
        );
        
        if (changedProps.length > 0) {
          console.log('Changed props:', changedProps);
          changedProps.forEach(prop => {
            console.log(`  ${prop}:`, {
              old: prevProps.current[prop],
              new: props[prop]
            });
          });
        } else {
          console.log('No props changed - unnecessary render?');
        }
      }
      
      console.groupEnd();
    }
    
    prevProps.current = props;
  });
};
```

## 🌐 API and Network Issues

### API Request Debugging

```javascript
// utils/api-debug.js
export const debugApiRequest = (url, options, response) => {
  console.group(`🌐 API Request Debug: ${options.method} ${url}`);
  
  console.log('Request Details:', {
    url,
    method: options.method,
    headers: sanitizeHeaders(options.headers),
    timestamp: new Date().toISOString()
  });
  
  if (options.body) {
    console.log('Request Body:', sanitizeRequestBody(options.body));
  }
  
  console.log('Response:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  console.groupEnd();
};

const sanitizeHeaders = (headers) => {
  const sanitized = { ...headers };
  if (sanitized.Authorization) {
    sanitized.Authorization = '[REDACTED]';
  }
  return sanitized;
};
```

## 🗄 State Management Debugging

### Redux State Debugging

```javascript
// utils/redux-debug.js
export const debugReduxState = (statePath, state) => {
  console.group(`🗄 Redux State Debug: ${statePath}`);
  
  const stateValue = statePath.split('.').reduce((obj, key) => obj?.[key], state);
  
  console.log('Current State:', stateValue);
  console.log('State Type:', typeof stateValue);
  console.log('Is Array:', Array.isArray(stateValue));
  console.log('Keys:', typeof stateValue === 'object' ? Object.keys(stateValue) : 'N/A');
  
  if (typeof stateValue === 'object' && stateValue !== null) {
    console.log('State Size:', JSON.stringify(stateValue).length);
  }
  
  console.groupEnd();
};
```

## 🌍 Browser-Specific Issues

### Browser Compatibility Debugging

```javascript
// utils/browser-debug.js
export const debugBrowserCompatibility = () => {
  console.group('🌍 Browser Compatibility Debug');
  
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
  
  console.log('Browser Info:', browserInfo);
  
  // Check for required features
  const features = {
    localStorage: typeof Storage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    promises: typeof Promise !== 'undefined',
    arrow: (() => { try { eval('() => {}'); return true; } catch { return false; } })(),
    modules: typeof Symbol !== 'undefined'
  };
  
  console.log('Feature Support:', features);
  
  const unsupportedFeatures = Object.keys(features).filter(key => !features[key]);
  if (unsupportedFeatures.length > 0) {
    console.warn('Unsupported Features:', unsupportedFeatures);
  }
  
  console.groupEnd();
};
```

## 🚀 Production Debugging

### Production Error Handling

```javascript
// utils/production-debug.js
export const setupProductionDebugging = () => {
  if (process.env.NODE_ENV === 'production') {
    // Global error handler
    window.addEventListener('error', (event) => {
      const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      // Send to error tracking service
      sendErrorToService(errorInfo);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      // Send to error tracking service
      sendErrorToService(errorInfo);
    });
  }
};
```

This debugging guide provides comprehensive tools and strategies for debugging banking applications with a focus on security, financial accuracy, and production-ready error handling.
