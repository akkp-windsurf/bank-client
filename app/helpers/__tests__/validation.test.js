import {
  nameValidation,
  emailValidation,
  numberValidation,
  disabledSpacesInput,
} from '../index';

describe('Validation Helpers', () => {
  describe('nameValidation', () => {
    it('should validate correct names', () => {
      expect(nameValidation('John')).toBe(true);
      expect(nameValidation('Mary-Jane')).toBe(true);
      expect(nameValidation("O'Connor")).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(nameValidation('')).toBe(false);
      expect(nameValidation('123')).toBe(false);
      expect(nameValidation('John123')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(nameValidation('   ')).toBe(true); // spaces are valid in names
      expect(nameValidation(null)).toBe(true); // regex.test(null) returns true
      expect(nameValidation(undefined)).toBe(true); // regex.test(undefined) returns true
      expect(nameValidation('A')).toBe(true);
    });
  });

  describe('emailValidation', () => {
    it('should validate correct email addresses', () => {
      expect(emailValidation('test@example.com')).toBe(true);
      expect(emailValidation('user.name@domain.co.uk')).toBe(true);
      expect(emailValidation('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(emailValidation('invalid-email')).toBe(false);
      expect(emailValidation('@example.com')).toBe(false);
      expect(emailValidation('test@')).toBe(false);
      expect(emailValidation('test.example.com')).toBe(false);
      expect(emailValidation('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(emailValidation(null)).toBe(false);
      expect(emailValidation(undefined)).toBe(false);
      expect(emailValidation('   ')).toBe(false);
    });
  });

  describe('numberValidation', () => {
    it('should validate numeric strings', () => {
      expect(numberValidation('123')).toBe(true);
      expect(numberValidation('0')).toBe(true);
      expect(numberValidation('999999')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(numberValidation('abc')).toBe(false);
      expect(numberValidation('12a')).toBe(false);
      expect(numberValidation('1.23')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(numberValidation('')).toBe(true); // empty string matches /^[0-9]*$/
      expect(numberValidation(null)).toBe(false); // regex.test(null) returns false
      expect(numberValidation(undefined)).toBe(false); // regex.test(undefined) returns false
      expect(numberValidation('   ')).toBe(false);
    });
  });

  describe('disabledSpacesInput', () => {
    it('should prevent space key events', () => {
      const mockEvent = {
        which: 32,
        preventDefault: jest.fn(),
      };

      const result = disabledSpacesInput(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should allow non-space key events', () => {
      const mockEvent = {
        which: 65, // 'A' key
        preventDefault: jest.fn(),
      };

      const result = disabledSpacesInput(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle edge cases', () => {
      expect(disabledSpacesInput({})).toBeUndefined();
      expect(disabledSpacesInput({ which: null })).toBeUndefined();
    });
  });
});
