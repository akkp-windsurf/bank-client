import routes from '../routes';

describe('routes utility', () => {
  it('should export route constants', () => {
    expect(routes).toBeDefined();
    expect(typeof routes).toBe('object');
  });

  it('should have route objects with name and path properties', () => {
    const routeKeys = Object.keys(routes);
    expect(routeKeys.length).toBeGreaterThan(0);

    routeKeys.forEach((key) => {
      expect(routes[key]).toHaveProperty('name');
      expect(routes[key]).toHaveProperty('path');
      expect(typeof routes[key].path).toBe('string');
    });
  });

  it('should have specific route paths', () => {
    expect(routes.home.path).toBe('/');
    expect(routes.login.path).toBe('/login');
    expect(routes.register.path).toBe('/register');
    expect(routes.dashboard.path).toBe('/dashboard');
    expect(routes.payment.path).toBe('/payment');
    expect(routes.history.path).toBe('/history');
    expect(routes.settings.path).toBe('/settings');
    expect(routes.privacy.path).toBe('/privacy');
    expect(routes.forgetPassword.path).toBe('/password/forget');
    expect(routes.resetPassword.path).toBe('/password/reset');
    expect(routes.notFound.path).toBe('/404');
  });
});
