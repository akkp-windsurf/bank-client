import api from '../api';

describe('api utility', () => {
  it('should have auth endpoints defined', () => {
    expect(api.auth.login).toContain('/Auth/login');
    expect(api.auth.register).toContain('/Auth/register');
    expect(api.auth.logout).toContain('/Auth/logout');
    expect(api.auth.forgetPassword).toContain('/Auth/password/forget');
    expect(api.auth.resetPassword).toContain('/Auth/password/reset');
  });

  it('should have users function that returns endpoints', () => {
    expect(typeof api.users).toBe('function');
    expect(api.users()).toContain('/Users');
    expect(api.users('checkEmail')('test@test.com')).toContain(
      '/Users/test@test.com/checkEmail',
    );
  });

  it('should have currencies endpoint defined', () => {
    expect(api.currencies).toContain('/Currencies');
  });

  it('should have messages endpoint defined', () => {
    expect(api.messages).toContain('/Messages');
  });

  it('should have notifications endpoint defined', () => {
    expect(api.notifications).toContain('/Notifications');
  });

  it('should have bills function that returns endpoints', () => {
    expect(typeof api.bills).toBe('function');
    expect(api.bills()).toContain('/Bills');
    expect(api.bills('amountMoney')).toContain('/Bills/amountMoney');
    expect(api.bills('accountBalance')).toContain('/Bills/accountBalance');
    expect(api.bills('accountBalanceHistory')).toContain(
      '/Bills/accountBalanceHistory',
    );
    expect(api.bills('search')('123456')).toContain('/Bills/123456/search');
  });

  it('should have transactions function that returns endpoints', () => {
    expect(typeof api.transactions).toBe('function');
    expect(api.transactions()).toContain('/Transactions');
    expect(api.transactions('create')).toContain('/Transactions/create');
    expect(api.transactions('confirm')).toContain('/Transactions/confirm');
    expect(api.transactions('authorizationKey')('uuid123')).toContain(
      '/Transactions/uuid123/authorizationKey',
    );
    expect(api.transactions('confirmationFile')('uuid123', 'en')).toContain(
      '/Transactions/uuid123/en/confirmationFile',
    );
  });
});
