import {
  formatBill,
  truncateString,
  getAlertCount,
  hasOwnProperties,
  getRequestName,
} from '../index';

describe('Formatting Helpers', () => {
  describe('formatBill', () => {
    it('should format bill numbers correctly', () => {
      const billNumber = '12345678901234567890';
      const formatted = formatBill(billNumber);

      expect(formatted).toBe('12 3456 7890 1234 5678 90');
    });

    it('should handle short bill numbers', () => {
      const billNumber = '123456';
      const formatted = formatBill(billNumber);

      expect(formatted).toBe('12 3456');
    });

    it('should handle empty or invalid input', () => {
      expect(formatBill('')).toBe('');
      expect(formatBill(null)).toBe('');
      expect(formatBill(undefined)).toBe('');
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const longString =
        'This is a very long string that needs to be truncated';
      const truncated = truncateString(longString, 20);

      expect(truncated).toBe('This is a very long...');
      expect(truncated.length).toBe(23);
    });

    it('should not truncate short strings', () => {
      const shortString = 'Short string';
      const result = truncateString(shortString, 20);

      expect(result).toBe(shortString);
    });

    it('should handle edge cases', () => {
      expect(truncateString('', 10)).toBe('');
      expect(truncateString(null, 10)).toBe('');
      expect(truncateString('test', 0)).toBe('...');
    });
  });

  describe('getAlertCount', () => {
    it('should count alerts correctly', () => {
      const alerts = [
        { type: 'error', message: 'Error 1' },
        { type: 'warning', message: 'Warning 1' },
        { type: 'error', message: 'Error 2' },
      ];

      expect(getAlertCount(alerts, 'error')).toBe(2);
      expect(getAlertCount(alerts, 'warning')).toBe(1);
      expect(getAlertCount(alerts, 'info')).toBe(0);
    });

    it('should handle empty arrays', () => {
      expect(getAlertCount([], 'error')).toBe(0);
    });

    it('should handle invalid input', () => {
      expect(getAlertCount(null, 'error')).toBe(0);
      expect(getAlertCount(undefined, 'error')).toBe(0);
    });
  });

  describe('hasOwnProperties', () => {
    it('should check object properties correctly', () => {
      const obj = { name: 'John', age: 30, city: 'New York' };

      expect(hasOwnProperties(obj, ['name', 'age'])).toBe(true);
      expect(hasOwnProperties(obj, ['name', 'country'])).toBe(false);
      expect(hasOwnProperties(obj, [])).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(hasOwnProperties(null, ['name'])).toBe(false);
      expect(hasOwnProperties(undefined, ['name'])).toBe(false);
      expect(hasOwnProperties({}, ['name'])).toBe(false);
    });
  });

  describe('getRequestName', () => {
    it('should generate request names correctly', () => {
      const action = 'LOAD_USER_DATA';
      const requestName = getRequestName(action);

      expect(requestName).toBe('LOAD_USER_DATA_REQUEST');
    });

    it('should handle different action formats', () => {
      expect(getRequestName('LOGIN')).toBe('LOGIN_REQUEST');
      expect(getRequestName('FETCH_BILLS')).toBe('FETCH_BILLS_REQUEST');
    });

    it('should handle edge cases', () => {
      expect(getRequestName('')).toBe('_REQUEST');
      expect(getRequestName(null)).toBe('null_REQUEST');
    });
  });
});
