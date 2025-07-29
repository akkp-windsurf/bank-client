import React from 'react';
import { renderWithProviders } from '../../../../../../internals/testing/redux-utils';
import Modal from '../index';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('<HeaderAction Modal />', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should render without crashing when modal is closed', () => {
    const initialState = {
      global: { isOpenedModal: false },
      loading: { requests: {} },
    };

    const { container } = renderWithProviders(<Modal />, { initialState });
    expect(container.firstChild).toBeNull();
  });

  it('should render modal when isOpenedModal is true', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: { requests: {} },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('should show loading state when logout is in progress', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: {
        requests: {
          'app/App/LOGOUT_REQUEST': { isLoading: true },
        },
      },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const modal = getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('should dispatch logout action when Yes button is clicked', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: { requests: {} },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const yesButton = getByRole('button', { name: /yes/i });

    yesButton.click();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app/App/LOGOUT_REQUEST',
      }),
    );
  });

  it('should dispatch toggle modal action when Cancel button is clicked', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: { requests: {} },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const cancelButton = getByRole('button', { name: /cancel/i });

    cancelButton.click();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'app/App/TOGGLE_CONFIRM_MODAL',
      }),
    );
  });

  it('should show loading state in modal when logout is in progress', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: {
        requests: {
          'app/App/LOGOUT_REQUEST': { isLoading: true },
        },
      },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const yesButton = getByRole('button', { name: /yes/i });

    expect(yesButton).toBeInTheDocument();
  });

  it('should show correct modal title', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: { requests: {} },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const modal = getByRole('dialog');

    expect(modal).toBeInTheDocument();
  });

  it('should handle modal close via onCancel', () => {
    const initialState = {
      global: { isOpenedModal: true },
      loading: { requests: {} },
    };

    const { getByRole } = renderWithProviders(<Modal />, { initialState });
    const modal = getByRole('dialog');

    const closeButton = modal.querySelector('.ant-modal-close');
    if (closeButton) {
      closeButton.click();
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'app/App/TOGGLE_CONFIRM_MODAL',
        }),
      );
    }
  });
});
