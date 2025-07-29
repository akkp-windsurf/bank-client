# Environment Setup Guide - Bank Client

This comprehensive guide covers setting up development, staging, and production environments for the Bank Client frontend application with a focus on banking security and compliance requirements.

## 📋 Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Development Environment](#development-environment)
- [Staging Environment](#staging-environment)
- [Production Environment](#production-environment)
- [Environment Variables](#environment-variables)
- [Security Configuration](#security-configuration)
- [Banking Compliance](#banking-compliance)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## 🌍 Overview

### Environment Strategy

The Bank Client application follows a three-tier environment strategy:

- **Development** - Local development and feature testing
- **Staging** - Pre-production testing and integration validation
- **Production** - Live banking application serving customers

### Security Principles

All environments must adhere to banking security standards:
- **Encryption in transit and at rest**
- **Secure authentication and authorization**
- **Comprehensive audit logging**
- **Regular security updates**
- **Compliance with banking regulations**

## 💻 System Requirements

### Hardware Requirements

#### Development Environment
- **CPU**: 4+ cores (Intel i5/AMD Ryzen 5 or better)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB available space (SSD recommended)
- **Network**: Stable internet connection

#### Staging/Production Environment
- **CPU**: 8+ cores (Intel Xeon/AMD EPYC)
- **RAM**: 16GB minimum, 32GB recommended
- **Storage**: 100GB+ SSD with backup
- **Network**: High-speed, redundant connections

### Software Requirements

#### Operating System
- **Linux**: Ubuntu 20.04+ LTS, CentOS 8+, RHEL 8+
- **macOS**: 10.15+ (development only)
- **Windows**: 10+ with WSL2 (development only)

#### Runtime Dependencies
- **Node.js**: v16.14+ LTS
- **Yarn**: v1.22+
- **Git**: v2.25+
- **Docker**: v20.10+ (optional)

#### Development Tools
- **Code Editor**: VS Code, WebStorm, or similar
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Terminal**: Modern terminal with UTF-8 support

## 🛠 Development Environment

### Initial Setup

#### 1. Install Node.js and Yarn
```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16.14.0
nvm use 16.14.0
nvm alias default 16.14.0

# Install Yarn
npm install -g yarn

# Verify installations
node --version  # Should show v16.14.0+
yarn --version  # Should show 1.22.0+
```

#### 2. Clone and Setup Repository
```bash
# Clone repository
git clone https://github.com/akkp-windsurf/bank-client.git
cd bank-client

# Install dependencies
yarn install

# Verify installation
yarn --check-files
```

#### 3. Environment Configuration
```bash
# Create development environment file
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

#### 4. Development Environment Variables
```bash
# .env.development
NODE_ENV=development
PORT=3000

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:4000/bank
REACT_APP_API_TIMEOUT=30000

# Authentication
REACT_APP_JWT_STORAGE_KEY=bank_auth_token
REACT_APP_SESSION_TIMEOUT=900000

# Security
REACT_APP_ENABLE_DEVTOOLS=true
REACT_APP_DISABLE_CONSOLE_LOGS=false

# Banking Features
REACT_APP_CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
REACT_APP_DEFAULT_CURRENCY=USD
REACT_APP_TRANSACTION_LIMIT=10000.00

# Development Tools
REACT_APP_MOCK_API=false
REACT_APP_DEBUG_MODE=true
GENERATE_SOURCEMAP=true
```

#### 5. Start Development Server
```bash
# Start development server
yarn start

# The application will be available at:
# http://localhost:3000
```

### Development Tools Configuration

#### VS Code Setup
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
```

#### ESLint Configuration
```javascript
// .eslintrc.js (already configured)
module.exports = {
  extends: ['react-app', 'airbnb'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
};
```

#### Prettier Configuration
```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

### Development Workflow

#### Daily Development Process
```bash
# Start of day
git checkout develop
git pull origin develop
yarn install  # Update dependencies if needed

# Start development server
yarn start

# Run tests in watch mode (separate terminal)
yarn test:watch

# Run linting (separate terminal)
yarn lint:watch
```

#### Pre-commit Checks
```bash
# Run all quality checks
yarn test
yarn lint
yarn build
yarn test:coverage
```

## 🎭 Staging Environment

### Infrastructure Setup

#### Server Configuration
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/akkp-windsurf/bank-client.git
cd bank-client

# Checkout staging branch
git checkout staging

# Install dependencies
yarn install --frozen-lockfile

# Build application
yarn build

# Configure PM2
pm2 start ecosystem.config.js --env staging
pm2 save
pm2 startup
```

#### Staging Environment Variables
```bash
# .env.staging
NODE_ENV=staging
PORT=3000

# API Configuration
REACT_APP_API_BASE_URL=https://api-staging.bankapp.com/bank
REACT_APP_API_TIMEOUT=30000

# Authentication
REACT_APP_JWT_STORAGE_KEY=bank_auth_token
REACT_APP_SESSION_TIMEOUT=900000

# Security
REACT_APP_ENABLE_DEVTOOLS=false
REACT_APP_DISABLE_CONSOLE_LOGS=true

# Banking Features
REACT_APP_CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
REACT_APP_DEFAULT_CURRENCY=USD
REACT_APP_TRANSACTION_LIMIT=10000.00

# Staging Specific
REACT_APP_ENVIRONMENT=staging
REACT_APP_MOCK_API=false
REACT_APP_DEBUG_MODE=false
GENERATE_SOURCEMAP=false
```

## 🚀 Production Environment

### Infrastructure Requirements

#### High Availability Setup
- **Load Balancer**: Multiple frontend instances behind load balancer
- **CDN**: Content delivery network for static assets
- **SSL/TLS**: Valid certificates with proper cipher suites
- **Monitoring**: Comprehensive monitoring and alerting
- **Backup**: Regular backups and disaster recovery plan

#### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=3000

# API Configuration
REACT_APP_API_BASE_URL=https://api.bankapp.com/bank
REACT_APP_API_TIMEOUT=30000

# Authentication
REACT_APP_JWT_STORAGE_KEY=bank_auth_token
REACT_APP_SESSION_TIMEOUT=900000

# Security
REACT_APP_ENABLE_DEVTOOLS=false
REACT_APP_DISABLE_CONSOLE_LOGS=true

# Banking Features
REACT_APP_CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
REACT_APP_DEFAULT_CURRENCY=USD
REACT_APP_TRANSACTION_LIMIT=10000.00

# Production Specific
REACT_APP_ENVIRONMENT=production
REACT_APP_MOCK_API=false
REACT_APP_DEBUG_MODE=false
GENERATE_SOURCEMAP=false

# Analytics and Monitoring
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
REACT_APP_HOTJAR_ID=XXXXXXX
```

## 🔒 Security Configuration

### Content Security Policy

```javascript
// utils/csp.js
const generateCSP = (environment) => {
  const basePolicy = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  if (environment === 'development') {
    basePolicy['script-src'].push("'unsafe-eval'");
    basePolicy['connect-src'].push('ws:', 'wss:');
  }

  if (environment === 'production') {
    basePolicy['connect-src'].push('https://api.bankapp.com');
  } else if (environment === 'staging') {
    basePolicy['connect-src'].push('https://api-staging.bankapp.com');
  } else {
    basePolicy['connect-src'].push('http://localhost:4000');
  }

  return Object.entries(basePolicy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

export default generateCSP;
```

## 🏦 Banking Compliance

### GDPR Compliance

#### Data Protection Configuration
```javascript
// utils/gdpr.js
export const gdprConfig = {
  cookieConsent: {
    required: true,
    categories: ['necessary', 'analytics', 'marketing'],
    defaultConsent: {
      necessary: true,
      analytics: false,
      marketing: false,
    },
  },
  dataRetention: {
    userSessions: '30 days',
    transactionLogs: '7 years',
    auditLogs: '10 years',
  },
  userRights: {
    dataAccess: true,
    dataPortability: true,
    dataErasure: true,
    dataRectification: true,
  },
};
```

### PCI DSS Compliance

#### Secure Data Handling
```javascript
// utils/pciCompliance.js
export const pciConfig = {
  dataEncryption: {
    inTransit: 'TLS 1.2+',
    atRest: 'AES-256',
  },
  accessControl: {
    multiFactorAuth: true,
    sessionTimeout: 15, // minutes
    passwordPolicy: {
      minLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      requireLowercase: true,
    },
  },
  auditLogging: {
    enabled: true,
    logLevel: 'INFO',
    retentionPeriod: '1 year',
  },
};
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Error Tracking with Sentry
```javascript
// utils/monitoring.js
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

export const initializeMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [
        new Integrations.BrowserTracing(),
      ],
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Filter out sensitive data
        if (event.request?.data) {
          delete event.request.data.password;
          delete event.request.data.token;
        }
        return event;
      },
    });
  }
};
```

## 🔧 Troubleshooting

### Common Environment Issues

#### Node.js Version Conflicts
```bash
# Check current version
node --version

# Install correct version
nvm install 16.14.0
nvm use 16.14.0
nvm alias default 16.14.0
```

#### Dependency Installation Issues
```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

#### Build Failures
```bash
# Check for TypeScript errors
yarn type-check

# Check for linting errors
yarn lint

# Increase memory limit for builds
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

This comprehensive environment setup guide ensures that the Bank Client application can be deployed securely and reliably across all environments while maintaining banking industry standards for security and compliance.
