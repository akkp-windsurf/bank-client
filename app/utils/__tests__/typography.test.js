import typography from '../typography';

describe('typography utility', () => {
  it('should export typography constants', () => {
    expect(typography).toBeDefined();
    expect(typeof typography).toBe('object');
  });

  it('should have fontWeightLight', () => {
    expect(typography.fontWeightLight).toBe('400');
  });

  it('should have fontWeightMedium', () => {
    expect(typography.fontWeightMedium).toBe('500');
  });

  it('should have fontWeightBold', () => {
    expect(typography.fontWeightBold).toBe('700');
  });

  it('should have all expected typography properties', () => {
    const expectedKeys = [
      'fontWeightLight',
      'fontWeightMedium',
      'fontWeightBold',
    ];
    const actualKeys = Object.keys(typography);

    expectedKeys.forEach((key) => {
      expect(actualKeys).toContain(key);
    });
  });

  it('should have valid font weight values', () => {
    const fontWeights = Object.values(typography);
    fontWeights.forEach((weight) => {
      expect(typeof weight).toBe('string');
      expect(weight).toMatch(/^\d{3}$/);
    });
  });
});
