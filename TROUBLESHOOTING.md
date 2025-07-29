# Troubleshooting Guide - Bank Client

This guide helps developers resolve common issues encountered during development of the Bank Client application.

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Build Issues](#build-issues)
- [Testing Issues](#testing-issues)
- [Linting and Code Quality](#linting-and-code-quality)
- [API and Authentication Issues](#api-and-authentication-issues)
- [Banking-Specific Issues](#banking-specific-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)

## 🔧 Installation Issues

### Node.js Version Conflicts

**Problem:** Application fails to start due to Node.js version incompatibility.

**Symptoms:**
```bash
error @babel/core@7.10.5: The engine "node" is incompatible with this module
```

**Solution:**
```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 16.14.0
nvm use 16.14.0

# Verify version
node --version

# Clear npm cache and reinstall
rm -rf node_modules package-lock.json yarn.lock
yarn install
```

### Yarn Installation Issues

**Problem:** Yarn fails to install dependencies.

**Symptoms:**
```bash
error An unexpected error occurred: "EACCES: permission denied"
```

**Solutions:**

1. **Permission Issues:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use yarn without sudo
yarn install --no-optional
```

2. **Network Issues:**
```bash
# Clear yarn cache
yarn cache clean

# Use different registry
yarn install --registry https://registry.npmjs.org/

# Install with network timeout
yarn install --network-timeout 100000
```

### Dependency Conflicts

**Problem:** Conflicting package versions causing installation failures.

**Solution:**
```bash
# Check for outdated packages
yarn outdated

# Update specific package
yarn upgrade package-name

# Force resolution in package.json
{
  "resolutions": {
    "babel-core": "7.0.0-bridge.0"
  }
}
```

## 🚀 Development Server Issues

### Port Already in Use

**Problem:** Development server fails to start because port 3000 is occupied.

**Symptoms:**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process using port:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 yarn start
```

2. **Use different port permanently:**
```bash
# Create .env file
echo "PORT=3001" > .env
```

### Hot Reload Not Working

**Problem:** Changes to code don't trigger automatic reload.

**Solutions:**

1. **Check file watchers limit:**
```bash
# Increase file watchers limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. **Disable safe write in IDE:**
- **VS Code:** Set `"files.watcherExclude"` in settings
- **WebStorm:** Disable "Use safe write"

3. **Check webpack configuration:**
```javascript
// webpack.dev.js
module.exports = {
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
  },
};
```

### Memory Issues

**Problem:** Development server runs out of memory.

**Symptoms:**
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
yarn start

# Or add to package.json scripts
{
  "scripts": {
    "start": "node --max-old-space-size=4096 server"
  }
}
```

## 🏗 Build Issues

### Production Build Failures

**Problem:** Build fails during production compilation.

**Common Issues and Solutions:**

1. **TypeScript Errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type errors or add type assertions
const value = (data as any).property;
```

2. **ESLint Errors:**
```bash
# Run ESLint to see all errors
yarn lint

# Fix automatically where possible
yarn lint:fix

# Disable specific rules if necessary
/* eslint-disable-next-line no-console */
console.log('Debug info');
```

3. **Bundle Size Issues:**
```bash
# Analyze bundle size
yarn analyze

# Check for large dependencies
npx webpack-bundle-analyzer build/static/js/*.js
```

### Webpack Configuration Issues

**Problem:** Custom webpack configuration causing build failures.

**Solution:**
```javascript
// Check webpack configuration
const config = require('./internals/webpack/webpack.prod.babel.js');
console.log(JSON.stringify(config, null, 2));

// Common fixes:
module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    }
  }
};
```

## 🧪 Testing Issues

### Jest Configuration Problems

**Problem:** Tests fail to run or find modules.

**Solutions:**

1. **Module Resolution:**
```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/app/components/$1',
    '^containers/(.*)$': '<rootDir>/app/containers/$1',
    '^utils/(.*)$': '<rootDir>/app/utils/$1',
  },
};
```

2. **Transform Issues:**
```javascript
// jest.config.js
module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/internals/mocks/cssModule.js',
  },
};
```

### Test Coverage Issues

**Problem:** Coverage reports show incorrect or missing coverage.

**Solutions:**

1. **Coverage Configuration:**
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
};
```

2. **Exclude Files from Coverage:**
```javascript
// Add to file that should be excluded
/* istanbul ignore file */
```

### React Testing Library Issues

**Problem:** Tests fail with React Testing Library queries.

**Common Solutions:**

1. **Element Not Found:**
```javascript
// Instead of getBy, use findBy for async elements
const element = await screen.findByText('Loading...');

// Use queryBy to check if element doesn't exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();
```

2. **Act Warnings:**
```javascript
// Wrap state updates in act
import { act } from '@testing-library/react';

act(() => {
  // State updates here
});
```

## 🔍 Linting and Code Quality

### ESLint Configuration Issues

**Problem:** ESLint rules conflicting or not working properly.

**Solutions:**

1. **Rule Conflicts:**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['airbnb', 'prettier'], // prettier should be last
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    // Override specific rules
    'react/jsx-props-no-spreading': 'off',
  },
};
```

2. **Import Resolution:**
```javascript
// .eslintrc.js
module.exports = {
  settings: {
    'import/resolver': {
      webpack: {
        config: './internals/webpack/webpack.prod.babel.js',
      },
    },
  },
};
```

### Prettier Formatting Issues

**Problem:** Prettier and ESLint formatting conflicts.

**Solution:**
```bash
# Install eslint-config-prettier
yarn add --dev eslint-config-prettier

# Update .eslintrc.js
{
  "extends": ["airbnb", "prettier", "prettier/react"]
}

# Run both tools
yarn lint:fix
yarn prettify "app/**/*.{js,jsx}"
```

## 🔐 API and Authentication Issues

### CORS Issues

**Problem:** API requests blocked by CORS policy.

**Symptoms:**
```
Access to fetch at 'http://localhost:4000/bank/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**

1. **Development Proxy:**
```javascript
// package.json
{
  "proxy": "http://localhost:4000"
}

// Or use custom proxy in webpack
module.exports = {
  devServer: {
    proxy: {
      '/bank': 'http://localhost:4000',
    },
  },
};
```

2. **Backend CORS Configuration:**
```javascript
// Ensure backend allows frontend origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Authentication Token Issues

**Problem:** JWT tokens not being sent or received properly.

**Solutions:**

1. **Token Storage:**
```javascript
// utils/auth.js
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    // Also set in axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};
```

2. **Token Expiration:**
```javascript
// utils/auth.js
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};
```

### API Response Handling

**Problem:** API responses not handled correctly.

**Solutions:**

1. **Error Handling:**
```javascript
// utils/api.js
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Show access denied message
        break;
      default:
        // Show generic error
        break;
    }
  } else if (error.request) {
    // Network error
    console.error('Network error:', error.request);
  }
};
```

## 🏦 Banking-Specific Issues

### Currency Calculation Errors

**Problem:** Floating-point precision issues in financial calculations.

**Symptoms:**
```javascript
0.1 + 0.2 = 0.30000000000000004
```

**Solution:**
```javascript
// Use decimal.js for precise calculations
import { Decimal } from 'decimal.js';

const calculateTotal = (amount, rate) => {
  const amountDecimal = new Decimal(amount);
  const rateDecimal = new Decimal(rate);
  return amountDecimal.mul(rateDecimal).toNumber();
};

// For display, always format to 2 decimal places
const formatCurrency = (amount) => {
  return new Decimal(amount).toFixed(2);
};
```

### Transaction Validation Issues

**Problem:** Client-side validation not matching server-side validation.

**Solution:**
```javascript
// Ensure validation rules match backend
const validateTransactionAmount = (amount, balance) => {
  const amountDecimal = new Decimal(amount);
  const balanceDecimal = new Decimal(balance);
  
  if (amountDecimal.lte(0)) {
    return 'Amount must be greater than zero';
  }
  
  if (amountDecimal.gt(balanceDecimal)) {
    return 'Insufficient funds';
  }
  
  // Check minimum transaction amount
  if (amountDecimal.lt(0.01)) {
    return 'Minimum transaction amount is 0.01';
  }
  
  return null;
};
```

### Internationalization Issues

**Problem:** Currency and number formatting not working correctly.

**Solution:**
```javascript
// utils/formatting.js
export const formatCurrency = (amount, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Usage in component
const formattedAmount = formatCurrency(1234.56, 'USD', 'en-US');
// Result: "$1,234.56"
```

## ⚡ Performance Issues

### Slow Rendering

**Problem:** Components re-rendering too frequently.

**Solutions:**

1. **Use React.memo:**
```javascript
import React, { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Component implementation
});

// With custom comparison
const ExpensiveComponent = memo(({ data }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

2. **Optimize selectors:**
```javascript
// Use reselect for memoized selectors
import { createSelector } from 'reselect';

const selectExpensiveData = createSelector(
  [selectRawData],
  (rawData) => {
    // Expensive computation
    return processData(rawData);
  }
);
```

### Bundle Size Issues

**Problem:** Application bundle too large.

**Solutions:**

1. **Code splitting:**
```javascript
// Use React.lazy for route-based splitting
const DashboardPage = lazy(() => import('./containers/DashboardPage'));

// Use dynamic imports for large libraries
const loadChartLibrary = () => import('recharts');
```

2. **Analyze bundle:**
```bash
yarn analyze
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🌐 Browser Compatibility

### Internet Explorer Issues

**Problem:** Application not working in older browsers.

**Solutions:**

1. **Polyfills:**
```javascript
// Add to app.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```

2. **Babel configuration:**
```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        ie: '11',
      },
      useBuiltIns: 'entry',
      corejs: 3,
    }],
  ],
};
```

### Mobile Browser Issues

**Problem:** Application not working correctly on mobile devices.

**Solutions:**

1. **Viewport configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```

2. **Touch events:**
```javascript
// Handle touch events for mobile
const handleTouchStart = (e) => {
  // Touch handling logic
};

<div onTouchStart={handleTouchStart}>
  Content
</div>
```

## 🆘 Getting Help

### Debug Information to Collect

When reporting issues, include:

1. **Environment Information:**
```bash
node --version
yarn --version
npm --version
```

2. **Error Messages:**
- Full error stack trace
- Browser console errors
- Network tab information

3. **Steps to Reproduce:**
- Exact steps that cause the issue
- Expected vs actual behavior
- Screenshots or recordings

### Useful Debugging Tools

1. **React Developer Tools**
2. **Redux DevTools**
3. **Browser Network Tab**
4. **Console Logging**
5. **Source Maps**

### Common Commands for Debugging

```bash
# Clear all caches
rm -rf node_modules yarn.lock package-lock.json
yarn cache clean
yarn install

# Run with verbose logging
DEBUG=* yarn start

# Check for security vulnerabilities
yarn audit

# Update all dependencies
yarn upgrade-interactive
```

Remember: When in doubt, check the browser console first, then the network tab, then the React/Redux DevTools. Most issues can be diagnosed using these tools.
