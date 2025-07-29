import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { ConnectedRouter } from 'connected-react-router';
import configureStore from 'utils/configureStore';
import { DEFAULT_LOCALE } from 'utils/locales';

jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => children || null,
  HelmetProvider: ({ children }) => children,
}));

jest.mock('react-ga', () => ({
  initialize: jest.fn(),
  set: jest.fn(),
  pageview: jest.fn(),
}));

jest.mock('react-trend', () => {
  const ReactActual = jest.requireActual('react');

  const MockTrend = ({ children, ...props }) =>
    ReactActual.createElement(
      'div',
      { 'data-testid': 'trend-mock', ...props },
      children,
    );

  MockTrend.propTypes = {
    children: () => null,
  };

  return {
    __esModule: true,
    default: MockTrend,
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

if (typeof SVGPathElement === 'undefined') {
  global.SVGPathElement = class SVGPathElement {
    getTotalLength() {
      return 100;
    }

    getPointAtLength() {
      return { x: 0, y: 0 };
    }
  };
}

const originalCreateElement = document.createElement;
document.createElement = function createElement(tagName) {
  const element = originalCreateElement.call(this, tagName);
  if (tagName === 'path') {
    element.getTotalLength = jest.fn(() => 100);
    element.getPointAtLength = jest.fn(() => ({ x: 0, y: 0 }));
  }
  return element;
};

export const createTestStore = (initialState = {}) => {
  const history = createMemoryHistory();
  const store = configureStore(initialState, history);
  return { store, history };
};

export const renderWithProviders = (component, options = {}) => {
  const { initialState = {}, ...renderOptions } = options;
  const { store, history } = createTestStore(initialState);

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <IntlProvider locale={DEFAULT_LOCALE}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </IntlProvider>
    </Provider>
  );

  Wrapper.propTypes = {
    children: () => null,
  };

  return {
    store,
    history,
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
  };
};

export const mockSagaEffects = {
  call: jest.fn(),
  put: jest.fn(),
  select: jest.fn(),
  take: jest.fn(),
  fork: jest.fn(),
};

export const createMockAction = (type, payload = {}) => ({
  type,
  ...payload,
});

export const testReducer = (reducer, initialState, action, expectedState) => {
  expect(reducer(initialState, action)).toEqual(expectedState);
};
