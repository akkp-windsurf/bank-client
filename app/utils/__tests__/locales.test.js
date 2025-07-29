const { DEFAULT_LOCALE, appLocales } = require('../locales');

describe('locales utilities', () => {
  it('should have default locale defined', () => {
    expect(DEFAULT_LOCALE).toBeDefined();
    expect(typeof DEFAULT_LOCALE).toBe('string');
  });

  it('should have app locales array', () => {
    expect(appLocales).toBeDefined();
    expect(Array.isArray(appLocales)).toBe(true);
    expect(appLocales.length).toBeGreaterThan(0);
  });

  it('should include default locale in app locales', () => {
    expect(appLocales).toContain(DEFAULT_LOCALE);
  });

  it('should have expected locale values', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(appLocales).toEqual(['en', 'de', 'pl']);
  });

  it('should have default date format defined', () => {
    const { DEFAULT_DATE_FORMAT } = require('../locales'); // eslint-disable-line global-require
    expect(DEFAULT_DATE_FORMAT).toBeDefined();
    expect(typeof DEFAULT_DATE_FORMAT).toBe('string');
  });
});
