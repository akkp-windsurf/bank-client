import colors from '../colors';

describe('colors utility', () => {
  it('should export color constants', () => {
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  it('should have white color', () => {
    expect(colors.white).toBe('#fff');
  });

  it('should have black color', () => {
    expect(colors.black).toBe('#000');
  });

  it('should have primaryBlue color', () => {
    expect(colors.primaryBlue).toBe('#1890ff');
  });

  it('should have grey color', () => {
    expect(colors.grey).toBe('rgb(242, 244, 247)');
  });

  it('should have red color', () => {
    expect(colors.red).toBe('rgb(229, 0, 0)');
  });

  it('should have redErr color', () => {
    expect(colors.redErr).toBe('#ff4d4f');
  });

  it('should have silver color', () => {
    expect(colors.silver).toBe('#bababa');
  });

  it('should have all expected color properties', () => {
    const expectedKeys = [
      'white',
      'black',
      'primaryBlue',
      'grey',
      'red',
      'redErr',
      'silver',
    ];
    const actualKeys = Object.keys(colors);

    expectedKeys.forEach((key) => {
      expect(actualKeys).toContain(key);
    });
  });
});
