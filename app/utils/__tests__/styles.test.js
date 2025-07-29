import * as styles from '../styles';

describe('styles utility', () => {
  it('should export style constants', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have style definitions', () => {
    const styleKeys = Object.keys(styles);
    expect(styleKeys.length).toBeGreaterThan(0);
  });
});
