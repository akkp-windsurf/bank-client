import * as PaymentContent from '../index';

describe('PaymentContent exports', () => {
  it('should export Bill component', () => {
    expect(PaymentContent.Bill).toBeDefined();
    expect(typeof PaymentContent.Bill).toBe('function');
  });

  it('should export Recipient component', () => {
    expect(PaymentContent.Recipient).toBeDefined();
    expect(typeof PaymentContent.Recipient).toBe('function');
  });

  it('should export AmountMoney component', () => {
    expect(PaymentContent.AmountMoney).toBeDefined();
    expect(typeof PaymentContent.AmountMoney).toBe('function');
  });

  it('should export TransferTitle component', () => {
    expect(PaymentContent.TransferTitle).toBeDefined();
    expect(typeof PaymentContent.TransferTitle).toBe('function');
  });

  it('should export Confirm component', () => {
    expect(PaymentContent.Confirm).toBeDefined();
    expect(typeof PaymentContent.Confirm).toBe('function');
  });

  it('should export all expected components', () => {
    const expectedExports = [
      'Bill',
      'Recipient',
      'AmountMoney',
      'TransferTitle',
      'Confirm',
    ];
    const actualExports = Object.keys(PaymentContent);

    expectedExports.forEach((exportName) => {
      expect(actualExports).toContain(exportName);
    });
  });
});
