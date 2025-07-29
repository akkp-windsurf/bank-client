import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import PrivacyPage from '../index';

describe('<PrivacyPage />', () => {
  it('should render without crashing', () => {
    const { container } = renderWithProviders(<PrivacyPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render privacy content', () => {
    const { container } = renderWithProviders(<PrivacyPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
