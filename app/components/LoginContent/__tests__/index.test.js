import React from 'react';
import { Form } from 'antd';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import { PinCode, Password } from '../index';

describe('LoginContent Components', () => {
  describe('<PinCode />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(
        <Form>
          <PinCode onValidateFields={jest.fn()} />
        </Form>,
        { initialState },
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: true,
        },
      };

      const { container } = renderWithProviders(
        <Form>
          <PinCode onValidateFields={jest.fn()} />
        </Form>,
        { initialState },
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<Password />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(
        <Form>
          <Password onValidateFields={jest.fn()} />
        </Form>,
        { initialState },
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle error state', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
          error: 'Login failed',
        },
      };

      const { container } = renderWithProviders(
        <Form>
          <Password onValidateFields={jest.fn()} />
        </Form>,
        { initialState },
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
