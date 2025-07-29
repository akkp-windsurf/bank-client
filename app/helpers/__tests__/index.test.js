import {
  formatBill,
  numberValidation,
  nameValidation,
  emailValidation,
  getRequestName,
  hasOwnProperties,
  truncateString,
  disabledSpacesInput,
  getAlertCount,
} from '../index';

describe('Helper Functions', () => {
  describe('formatBill', () => {
    it('should format bill with amount money', () => {
      const bill = {
        id: 1,
        amountMoney: 1234.56,
        accountBillNumber: '12345678901234567890',
      };

      const result = formatBill(bill);

      expect(result.amountMoney).toBe('1,234.56');
      expect(result.accountBillNumber).toBe('12 3456 7890 1234 5678 90');
    });

    it('should handle bill without amount money', () => {
      const bill = {
        id: 1,
        accountBillNumber: '12345678901234567890',
      };

      const result = formatBill(bill);

      expect(result.amountMoney).toBeUndefined();
      expect(result.accountBillNumber).toBe('12 3456 7890 1234 5678 90');
    });

    it('should format account bill number correctly', () => {
      const bill = {
        accountBillNumber: '1234567890123456',
      };

      const result = formatBill(bill);

      expect(result.accountBillNumber).toBe('12 3456 7890 1234 56');
    });

    it('should preserve other bill properties', () => {
      const bill = {
        id: 1,
        title: 'Test Bill',
        amountMoney: 100.0,
        accountBillNumber: '1234567890123456',
        description: 'Test description',
      };

      const result = formatBill(bill);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Bill');
      expect(result.description).toBe('Test description');
    });
  });

  describe('numberValidation', () => {
    it('should return true for valid numbers', () => {
      expect(numberValidation('123')).toBe(true);
      expect(numberValidation('0')).toBe(true);
      expect(numberValidation('999999')).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(numberValidation('abc')).toBe(false);
      expect(numberValidation('12a')).toBe(false);
      expect(numberValidation('1.23')).toBe(false);
      expect(numberValidation('-123')).toBe(false);
      expect(numberValidation('12 34')).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(numberValidation('')).toBe(true);
    });
  });

  describe('nameValidation', () => {
    it('should return true for valid names', () => {
      expect(nameValidation('John')).toBe(true);
      expect(nameValidation('Mary Jane')).toBe(true);
      expect(nameValidation("O'Connor")).toBe(true);
      expect(nameValidation('Jean-Pierre')).toBe(true);
      expect(nameValidation('Smith, Jr.')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(nameValidation('John123')).toBe(false);
      expect(nameValidation('John@')).toBe(false);
      expect(nameValidation('John#')).toBe(false);
      expect(nameValidation('123')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(nameValidation('JOHN')).toBe(true);
      expect(nameValidation('john')).toBe(true);
      expect(nameValidation('JoHn')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(nameValidation('')).toBe(false);
    });
  });

  describe('emailValidation', () => {
    it('should return true for valid emails', () => {
      expect(emailValidation('test@example.com')).toBe(true);
      expect(emailValidation('user.name@domain.co.uk')).toBe(true);
      expect(emailValidation('user+tag@example.org')).toBe(true);
      expect(emailValidation('user_name@example-domain.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(emailValidation('invalid-email')).toBe(false);
      expect(emailValidation('@example.com')).toBe(false);
      expect(emailValidation('user@')).toBe(false);
      expect(emailValidation('user@.com')).toBe(false);
      expect(emailValidation('user.example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(emailValidation('')).toBe(false);
    });
  });

  describe('getRequestName', () => {
    it('should extract request name from action types', () => {
      expect(getRequestName('LOGIN_REQUEST')).toBe('LOGIN');
      expect(getRequestName('FETCH_USER_SUCCESS')).toBe('FETCH_USER');
      expect(getRequestName('UPDATE_PROFILE_ERROR')).toBe('UPDATE_PROFILE');
      expect(getRequestName('VALIDATE_EMAIL_INCORRECT')).toBe('VALIDATE_EMAIL');
    });

    it('should return false for invalid action types', () => {
      expect(getRequestName('INVALID_ACTION')).toBe(false);
      expect(getRequestName('LOGIN')).toBe(false);
      expect(getRequestName('')).toBe(false);
      expect(getRequestName('LOGIN_PENDING')).toBe(false);
    });

    it('should handle null or undefined input', () => {
      expect(getRequestName(null)).toBe(false);
      expect(getRequestName(undefined)).toBe(false);
    });
  });

  describe('hasOwnProperties', () => {
    it('should return true when object has at least one property', () => {
      const obj = { name: 'John', age: 30, email: 'john@example.com' };
      expect(hasOwnProperties(obj, ['name'])).toBe(true);
      expect(hasOwnProperties(obj, ['age', 'height'])).toBe(true);
      expect(hasOwnProperties(obj, ['name', 'age', 'email'])).toBe(true);
    });

    it('should return false when object has none of the properties', () => {
      const obj = { name: 'John', age: 30 };
      expect(hasOwnProperties(obj, ['height'])).toBe(false);
      expect(hasOwnProperties(obj, ['height', 'weight'])).toBe(false);
    });

    it('should handle empty properties array', () => {
      const obj = { name: 'John' };
      expect(hasOwnProperties(obj, [])).toBe(false);
    });

    it('should handle empty object', () => {
      expect(hasOwnProperties({}, ['name'])).toBe(false);
    });
  });

  describe('truncateString', () => {
    it('should truncate string longer than max length', () => {
      const longString = 'a'.repeat(200);
      const result = truncateString(longString);
      expect(result).toBe(`${'a'.repeat(190)}...`);
      expect(result.length).toBe(193);
    });

    it('should not truncate string shorter than max length', () => {
      const shortString = 'Hello World';
      expect(truncateString(shortString)).toBe('Hello World');
    });

    it('should use custom max length', () => {
      const string = 'Hello World';
      expect(truncateString(string, 5)).toBe('Hello...');
    });

    it('should handle null or undefined input', () => {
      expect(truncateString(null)).toBe(null);
      expect(truncateString(undefined)).toBe(null);
    });

    it('should handle empty string', () => {
      expect(truncateString('')).toBe('');
    });

    it('should handle string exactly at max length', () => {
      const string = 'a'.repeat(190);
      expect(truncateString(string)).toBe(string);
    });
  });

  describe('disabledSpacesInput', () => {
    it('should prevent space key (keyCode 32)', () => {
      const mockEvent = {
        which: 32,
        preventDefault: jest.fn(),
      };

      const result = disabledSpacesInput(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should allow other keys', () => {
      const mockEvent = {
        which: 65, // 'A' key
        preventDefault: jest.fn(),
      };

      const result = disabledSpacesInput(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle different key codes', () => {
      const allowedKeys = [13, 27, 65, 97]; // Enter, Escape, A, a

      allowedKeys.forEach((keyCode) => {
        const mockEvent = {
          which: keyCode,
          preventDefault: jest.fn(),
        };

        disabledSpacesInput(mockEvent);
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('getAlertCount', () => {
    it('should return formatted count when user has notifications and messages', () => {
      const user = {
        userConfig: {
          notificationCount: 3,
          messageCount: 2,
        },
      };

      expect(getAlertCount(user)).toBe('(5)');
    });

    it('should return formatted count when user has only notifications', () => {
      const user = {
        userConfig: {
          notificationCount: 3,
          messageCount: 0,
        },
      };

      expect(getAlertCount(user)).toBe('(3)');
    });

    it('should return formatted count when user has only messages', () => {
      const user = {
        userConfig: {
          notificationCount: 0,
          messageCount: 2,
        },
      };

      expect(getAlertCount(user)).toBe('(2)');
    });

    it('should return empty string when user has no notifications or messages', () => {
      const user = {
        userConfig: {
          notificationCount: 0,
          messageCount: 0,
        },
      };

      expect(getAlertCount(user)).toBe('');
    });

    it('should handle null or undefined user', () => {
      expect(getAlertCount(null)).toBe('');
      expect(getAlertCount(undefined)).toBe('');
    });

    it('should handle user without userConfig', () => {
      const user = {};
      expect(getAlertCount(user)).toBe('');
    });

    it('should handle string numbers', () => {
      const user = {
        userConfig: {
          notificationCount: '3',
          messageCount: '2',
        },
      };

      expect(getAlertCount(user)).toBe('(5)');
    });
  });
});
