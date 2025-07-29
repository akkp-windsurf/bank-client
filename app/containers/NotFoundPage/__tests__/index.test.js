import React from 'react';
import { renderWithProviders } from '../../../../internals/testing/redux-utils';
import NotFoundPage from '../index';

describe('<NotFoundPage />', () => {
  it('should render without crashing', () => {
    const { container } = renderWithProviders(<NotFoundPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render 404 content', () => {
    const { container } = renderWithProviders(<NotFoundPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
