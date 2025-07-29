# Contributing Guide - Bank Client

Welcome to the Bank Client project! This guide will help you understand how to contribute effectively to our banking application frontend.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Banking-Specific Guidelines](#banking-specific-guidelines)
- [Security Considerations](#security-considerations)
- [Review Process](#review-process)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- **Be respectful** and considerate in all interactions
- **Be collaborative** and help others learn and grow
- **Be constructive** when providing feedback
- **Focus on the code**, not the person
- **Respect different viewpoints** and experiences

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Publishing private information without permission
- Any behavior that would be inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** v12.18+ (recommended: v16+)
- **Yarn** v1.22+ package manager
- **Git** for version control
- **Code editor** with ESLint and Prettier support

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
```bash
git clone https://github.com/YOUR_USERNAME/bank-client.git
cd bank-client
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/akkp-windsurf/bank-client.git
```

4. **Install dependencies:**
```bash
yarn install
```

5. **Verify setup:**
```bash
yarn test
yarn lint
yarn start
```

### Environment Configuration

1. **Configure API endpoint** in `app/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:4000/bank';
```

2. **Set up environment variables** (if needed):
```bash
cp .env.example .env
# Edit .env with your local configuration
```

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branch types:

- **`master`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/`** - New features or enhancements
- **`bugfix/`** - Bug fixes
- **`hotfix/`** - Critical production fixes

### Branch Naming Convention

```
feature/ISSUE_NUMBER-short-description
bugfix/ISSUE_NUMBER-short-description
hotfix/ISSUE_NUMBER-short-description

Examples:
feature/123-payment-authorization
bugfix/456-currency-conversion-error
hotfix/789-security-vulnerability
```

### Development Process

1. **Create a new branch:**
```bash
git checkout develop
git pull upstream develop
git checkout -b feature/123-payment-authorization
```

2. **Make your changes** following our coding standards

3. **Test your changes:**
```bash
yarn test
yarn lint
yarn build
```

4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add payment authorization flow

- Implement JWT token validation
- Add authorization key generation
- Update payment form validation
- Add comprehensive test coverage

Closes #123"
```

5. **Push to your fork:**
```bash
git push origin feature/123-payment-authorization
```

6. **Create a Pull Request** on GitHub

### Commit Message Convention

We follow **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

#### Examples

```bash
feat(auth): implement JWT token refresh mechanism
fix(payment): resolve currency conversion precision error
docs(readme): update installation instructions
test(transaction): add unit tests for validation logic
```

## 📏 Coding Standards

All contributions must follow our [Coding Standards](./CODING_STANDARDS.md). Key requirements:

### Code Quality

- **ESLint compliance** - All code must pass ESLint checks
- **Prettier formatting** - Code must be properly formatted
- **TypeScript types** - Proper type definitions required
- **Test coverage** - 98% minimum coverage requirement

### React/Redux Patterns

- **Functional components** with hooks preferred
- **Redux-Saga** for side effects
- **Reselect** for memoized selectors
- **Styled-components** for styling
- **PropTypes** for component validation

### Banking-Specific Requirements

- **Decimal.js** for financial calculations
- **Input validation** for all financial data
- **Security headers** in API calls
- **Audit logging** for sensitive operations

## 🧪 Testing Requirements

### Coverage Requirements

All contributions must maintain our strict testing standards:

- **Statements**: 98%
- **Branches**: 91%
- **Functions**: 98%
- **Lines**: 98%

### Test Types Required

1. **Unit Tests** - All components and utilities
2. **Integration Tests** - Component interactions
3. **Snapshot Tests** - UI consistency
4. **Accessibility Tests** - WCAG compliance

### Banking-Specific Testing

```javascript
// Example: Financial calculation tests
describe('Currency Conversion', () => {
  it('should handle precision correctly', () => {
    const result = convertCurrency(100.50, 1.2345);
    expect(result).toBe('124.07');
  });

  it('should validate transaction limits', () => {
    const isValid = validateTransactionAmount(10000, 5000);
    expect(isValid).toBe(false);
  });
});
```

## 📝 Pull Request Process

### Before Creating a PR

1. **Sync with upstream:**
```bash
git checkout develop
git pull upstream develop
git checkout your-feature-branch
git rebase develop
```

2. **Run all checks:**
```bash
yarn test
yarn lint
yarn build
yarn test:coverage
```

3. **Update documentation** if needed

### PR Requirements

- **Clear title** following conventional commits
- **Detailed description** of changes
- **Screenshots** for UI changes
- **Test results** showing coverage
- **Security considerations** documented

## 🏦 Banking-Specific Guidelines

### Financial Data Handling

```javascript
// Always use Decimal.js for financial calculations
import { Decimal } from 'decimal.js';

const calculateInterest = (principal, rate, time) => {
  const p = new Decimal(principal);
  const r = new Decimal(rate);
  const t = new Decimal(time);
  return p.mul(r).mul(t).toFixed(2);
};
```

### Security Requirements

- **Input sanitization** for all user inputs
- **XSS protection** using DOMPurify
- **CSRF tokens** for state-changing operations
- **Rate limiting** awareness in UI
- **Secure storage** of sensitive data

### Compliance Considerations

- **GDPR compliance** for user data
- **PCI DSS** awareness for payment data
- **Audit trails** for all transactions
- **Data retention** policies
- **Privacy by design** principles

## 🔐 Security Considerations

### Authentication

- **JWT tokens** must be stored securely
- **Token expiration** must be handled gracefully
- **Refresh tokens** should be implemented
- **Session management** must be secure

### Data Protection

```javascript
// Example: Secure API call
const makeSecureApiCall = async (endpoint, data) => {
  const token = getAuthToken();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(sanitizeInput(data)),
  });
  
  if (!response.ok) {
    throw new Error('API call failed');
  }
  
  return response.json();
};
```

## 👥 Review Process

### Code Review Checklist

#### General Code Quality
- [ ] Code follows ESLint rules
- [ ] Proper error handling
- [ ] No hardcoded values
- [ ] Appropriate comments where needed
- [ ] Performance considerations addressed

#### React/Redux Specific
- [ ] Components properly structured
- [ ] State management follows patterns
- [ ] Props validation implemented
- [ ] Hooks used correctly
- [ ] Memoization where appropriate

#### Banking/Security Specific
- [ ] Financial calculations accurate
- [ ] Security measures implemented
- [ ] Compliance requirements met
- [ ] Audit logging in place
- [ ] Data protection measures

#### Testing
- [ ] Adequate test coverage
- [ ] Edge cases covered
- [ ] Banking scenarios tested
- [ ] Accessibility tested
- [ ] Performance tested

### Review Timeline

- **Initial review**: Within 24 hours
- **Follow-up reviews**: Within 12 hours
- **Final approval**: Within 48 hours of submission

## 📚 Resources

### Documentation
- [Coding Standards](./CODING_STANDARDS.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Testing Guide](./TESTING.md)
- [Debugging Guide](./DEBUGGING.md)

### External Resources
- [React Documentation](https://reactjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Jest Testing Framework](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)

Thank you for contributing to the Bank Client project!
