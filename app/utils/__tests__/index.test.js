import * as utils from '../index';

describe('utils index', () => {
  it('should export colors', () => {
    expect(utils.colors).toBeDefined();
    expect(typeof utils.colors).toBe('object');
  });

  it('should export media', () => {
    expect(utils.media).toBeDefined();
  });

  it('should export request', () => {
    expect(utils.request).toBeDefined();
    expect(typeof utils.request).toBe('function');
  });

  it('should export typography', () => {
    expect(utils.typography).toBeDefined();
    expect(typeof utils.typography).toBe('object');
  });

  it('should export api', () => {
    expect(utils.api).toBeDefined();
    expect(typeof utils.api).toBe('object');
  });

  it('should export routes', () => {
    expect(utils.routes).toBeDefined();
    expect(typeof utils.routes).toBe('object');
  });

  it('should export locales', () => {
    expect(utils.locales).toBeDefined();
  });

  it('should export i18n', () => {
    expect(utils.i18n).toBeDefined();
  });

  it('should have all expected exports', () => {
    const expectedExports = [
      'colors',
      'media',
      'request',
      'typography',
      'api',
      'routes',
      'locales',
      'i18n',
    ];
    expectedExports.forEach((exportName) => {
      expect(utils[exportName]).toBeDefined();
    });
  });
});
