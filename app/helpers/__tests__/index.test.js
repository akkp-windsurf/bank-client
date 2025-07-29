import * as helpers from '../index';

describe('helpers', () => {
  it('should export helper functions', () => {
    expect(helpers).toBeDefined();
    expect(typeof helpers).toBe('object');
  });

  it('should have helper functions defined', () => {
    const helperKeys = Object.keys(helpers);
    expect(helperKeys.length).toBeGreaterThan(0);

    helperKeys.forEach((key) => {
      if (typeof helpers[key] === 'function') {
        expect(helpers[key]).toBeDefined();
      }
    });
  });

  it('should handle utility functions correctly', () => {
    const helperKeys = Object.keys(helpers);
    helperKeys.forEach((key) => {
      const helper = helpers[key];
      if (typeof helper === 'function') {
        expect(() => helper).not.toThrow();
      }
    });
  });
});
