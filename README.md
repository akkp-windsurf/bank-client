# Bank Client - Frontend Application

<div align="center">
<br>
    <a href="https://bank.pietrzakadrian.com"> 
        <img src="https://images.pietrzakadrian.com/logo.png" alt="Bank Application"/>
    </a>

[**Live Preview**](https://bank.pietrzakadrian.com) | [**Swagger Documentation**](https://api.pietrzakadrian.com/documentation) | [**Contact the developer**](mailto:contact@pietrzakadrian.com)

 <hr>
<h4>
Full Stack Web Application similar to financial software that is used in professional banking institutions.
</h4>

</div>

## 🏦 Banking Features

- **Double-entry bookkeeping** - Account balance calculated based on SQL operations
- **Multi-language support** - English, German, and Polish internationalization
- **Multi-currency support** - Real-time exchange rates from external API
- **Progressive Web App (PWA)** - Mobile-responsive design with offline capabilities
- **GDPR Compliance** - Cookie consent and Google Analytics integration
- **Security-first architecture** - JWT authentication and secure API communication

<hr>

<div align="center">
    <img src="https://images.pietrzakadrian.com/app_dashboard.png"  />
</div>

<hr>

## 🛠 Technology Stack

**Frontend Technologies:**
- **React.js** - Component-based UI library
- **Redux** - State management with Redux Toolkit
- **Redux-Saga** - Side effect management for async operations
- **Reselect** - Memoized state selectors
- **Immer** - Immutable state updates
- **Ant Design** - Enterprise-class UI components
- **styled-components** - CSS-in-JS styling solution
- **React Router** - Client-side routing
- **React Intl** - Internationalization support

**Development Tools:**
- **Webpack** - Module bundler with custom configuration
- **Babel** - JavaScript transpilation
- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting
- **Jest** - Testing framework with 98% coverage requirement
- **Husky** - Git hooks for pre-commit validation

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** v12.18+ (recommended: v16+)
- **yarn** v1.22+ (package manager)
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/akkp-windsurf/bank-client.git
cd bank-client
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Configure the API endpoint in `app/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:4000/bank'; // Update for your environment
```

For production deployment, update this to your production API URL.

### 4. Start Development Server

```bash
yarn start
```

The application will be available at `http://localhost:3000`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server |
| `yarn build` | Build for production |
| `yarn test` | Run test suite |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Generate coverage report |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint issues |
| `yarn prettify` | Format code with Prettier |
| `yarn analyze` | Analyze bundle size |

## 🏗 Project Structure

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

## 🔐 Security Considerations

This banking application implements several security measures:

- **JWT Token Authentication** - Secure API communication
- **HTTPS Enforcement** - All production traffic encrypted
- **Content Security Policy** - XSS protection
- **Input Validation** - Client-side validation with server verification
- **Secure Headers** - Security headers for production builds

## 🌍 Environment Setup

### Development Environment

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run tests
yarn test
```

### Production Build

```bash
# Build for production
yarn build

# Serve production build
yarn start:prod
```

### Environment Variables

The application uses the following environment configurations:

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 3000)
- `API_BASE_URL` - Backend API endpoint

## 📊 Testing

The project maintains a **98% test coverage requirement**. Tests are written using:

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **Jest Styled Components** - Styled components testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Coverage Requirements

- **Statements**: 98%
- **Branches**: 91%
- **Functions**: 98%
- **Lines**: 98%

## 🚀 Deployment

### Production Deployment

1. Build the application:
```bash
yarn build
```

2. Deploy the `build/` directory to your web server

3. Configure your web server to serve `index.html` for all routes (SPA routing)

### Environment-Specific Configuration

Update `app/utils/api.js` with the appropriate API endpoint for each environment:

- **Development**: `http://localhost:4000/bank`
- **Staging**: `https://staging-api.yourdomain.com/bank`
- **Production**: `https://api.yourdomain.com/bank`

## 📚 Additional Documentation

- [Coding Standards](./CODING_STANDARDS.md) - Development guidelines and best practices
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md) - Git workflow and development process
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Detailed environment configuration
- [Debugging Guide](./DEBUGGING.md) - Banking-specific debugging procedures
- [Testing Guide](./TESTING.md) - Comprehensive testing documentation
- [Onboarding](./ONBOARDING.md) - New developer onboarding guide

## 🤝 Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License. Copyright (c) 2020 Adrian Pietrzak.
