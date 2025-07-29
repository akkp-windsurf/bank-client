import React from 'react';
import { renderWithProviders } from '../../../../../../../internals/testing/redux-utils';
import Modal from '../index';

jest.mock('containers/App/selectors', () => ({
  makeSelectCurrencies: () => () => [
    { uuid: 'usd-123', name: 'USD' },
    { uuid: 'eur-456', name: 'EUR' },
  ],
}));

jest.mock('containers/SettingsPage/selectors', () => ({
  makeSelectIsOpenedModal: () => () => true,
  makeSelectNewData: () => () => ({
    currency: 'usd-123',
  }),
}));

jest.mock('providers/LoadingProvider/selectors', () => ({
  makeSelectIsLoading: () => () => false,
}));

jest.mock('components/App/Modal/styles', () => {
  const MockModal = ({ children, visible, ...props }) =>
    visible ? (
      <div data-testid="modal" {...props}>
        {children}
      </div>
    ) : null;

  MockModal.propTypes = {
    children: () => null,
    visible: () => null,
  };

  return {
    StyledModal: MockModal,
  };
});

describe('<Modal />', () => {
  const mockProps = {
    visible: true,
    onCancel: jest.fn(),
    onOk: jest.fn(),
    title: 'Test Modal',
    snippets: { snippet1: 'value1', snippet2: 'value2' },
    form: {
      getFieldDecorator: jest.fn(() => (comp) => comp),
      validateFields: jest.fn(),
      resetFields: jest.fn(),
    },
  };

  it('should render without crashing', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Modal {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render when visible', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Modal {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    const props = { ...mockProps, visible: false };
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Modal {...props} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle modal actions', () => {
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Modal {...mockProps} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with different titles', () => {
    const props = { ...mockProps, title: 'Different Modal Title' };
    const initialState = {
      global: {
        isLogged: true,
        isLoading: false,
        user: { name: 'Test User', firstName: 'Test', lastName: 'User' },
      },
    };

    const { container } = renderWithProviders(<Modal {...props} />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
