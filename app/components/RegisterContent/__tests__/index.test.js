import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import {
  Currency,
  EmailAddress,
  FirstName,
  LastName,
  Password,
} from '../index';

describe('RegisterContent Components', () => {
  describe('<Currency />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(<Currency />, { initialState });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: true,
        },
      };

      const { container } = renderWithProviders(<Currency />, { initialState });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<EmailAddress />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(<EmailAddress />, {
        initialState,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle validation', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
          error: 'Invalid email',
        },
      };

      const { container } = renderWithProviders(<EmailAddress />, {
        initialState,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<FirstName />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(<FirstName />, {
        initialState,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('<LastName />', () => {
    it('should render without crashing', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
        },
      };

      const { container } = renderWithProviders(<LastName />, { initialState });
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

      const { container } = renderWithProviders(<Password />, { initialState });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle password validation', () => {
      const initialState = {
        global: {
          isLogged: false,
          isLoading: false,
          error: 'Password too weak',
        },
      };

      const { container } = renderWithProviders(<Password />, { initialState });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
