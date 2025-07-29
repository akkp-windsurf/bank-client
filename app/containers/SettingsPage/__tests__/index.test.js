import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import SettingsPage from '../index';

describe('<SettingsPage />', () => {
  it('should render without crashing', () => {
    const initialState = {
      settingsPage: {
        isLoading: false,
        error: null,
        settings: {},
      },
    };

    const { container } = renderWithProviders(<SettingsPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render loading state', () => {
    const initialState = {
      settingsPage: {
        isLoading: true,
        error: null,
        settings: {},
      },
    };

    const { container } = renderWithProviders(<SettingsPage />, {
      initialState,
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
