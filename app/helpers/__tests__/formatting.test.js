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
      const bill = {
        accountBillNumber: '12345678901234567890',
        amountMoney: 1234.56,
      };
      const formatted = formatBill(bill);

      expect(formatted.accountBillNumber).toBe('12 3456 7890 1234 5678 90');
      expect(formatted.amountMoney).toBe('1,234.56');
    });

    it('should handle short bill numbers', () => {
      const bill = {
        accountBillNumber: '123456',
        amountMoney: 100,
      };
      const formatted = formatBill(bill);

      expect(formatted.accountBillNumber).toBe('12 3456');
      expect(formatted.amountMoney).toBe('100.00');
    });

    it('should handle bills with undefined accountBillNumber', () => {
      const bill = {
        amountMoney: 0,
      };

      expect(() => formatBill(bill)).toThrow();
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const longString =
        'This is a very long string that needs to be truncated';
      const truncated = truncateString(longString, 20);

      expect(truncated).toBe('This is a very long ...');
      expect(truncated.length).toBe(23);
    });

    it('should not truncate short strings', () => {
      const shortString = 'Short string';
      const result = truncateString(shortString, 20);

      expect(result).toBe(shortString);
    });

    it('should handle edge cases', () => {
      expect(truncateString('', 10)).toBe(null);
      expect(truncateString(null, 10)).toBe(null);
      expect(truncateString('test', 0)).toBe('...');
    });
  });

  describe('getAlertCount', () => {
    it('should count user notifications and messages', () => {
      const user = {
        userConfig: {
          notificationCount: 3,
          messageCount: 2,
        },
      };

      expect(getAlertCount(user)).toBe('(5)');
    });

    it('should handle zero counts', () => {
      const user = {
        userConfig: {
          notificationCount: 0,
          messageCount: 0,
        },
      };

      expect(getAlertCount(user)).toBe('');
    });

    it('should handle missing userConfig', () => {
      expect(getAlertCount({})).toBe('');
      expect(getAlertCount(null)).toBe('');
      expect(getAlertCount(undefined)).toBe('');
    });
  });

  describe('hasOwnProperties', () => {
    it('should check object properties correctly', () => {
      const obj = { name: 'John', age: 30, city: 'New York' };

      expect(hasOwnProperties(obj, ['name'])).toBe(true);
      expect(hasOwnProperties(obj, ['age'])).toBe(true);
      expect(hasOwnProperties(obj, ['name', 'age'])).toBe(true);
      expect(hasOwnProperties(obj, ['country'])).toBe(false);
      expect(hasOwnProperties(obj, [])).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(() => hasOwnProperties(null, ['name'])).toThrow();
      expect(() => hasOwnProperties(undefined, ['name'])).toThrow();
      expect(hasOwnProperties({}, ['name'])).toBe(false);
    });
  });

  describe('getRequestName', () => {
    it('should extract request names from action types', () => {
      expect(getRequestName('LOAD_USER_DATA_SUCCESS')).toBe('LOAD_USER_DATA');
      expect(getRequestName('LOGIN_REQUEST')).toBe('LOGIN');
      expect(getRequestName('FETCH_BILLS_ERROR')).toBe('FETCH_BILLS');
      expect(getRequestName('USER_UPDATE_INCORRECT')).toBe('USER_UPDATE');
    });

    it('should return false for invalid action types', () => {
      expect(getRequestName('LOGIN')).toBe(false);
      expect(getRequestName('FETCH_BILLS')).toBe(false);
      expect(getRequestName('')).toBe(false);
      expect(getRequestName(null)).toBe(false);
    });
  });
});
