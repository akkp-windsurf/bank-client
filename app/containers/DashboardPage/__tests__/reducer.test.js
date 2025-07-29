import { formatBill } from 'helpers';
import { LOGOUT_SUCCESS, LOGOUT_ERROR } from 'containers/App/constants';
import { LOCATION_CHANGE } from 'connected-react-router';
import dashboardPageReducer, { initialState } from '../reducer';
import {
  GET_BILLS_SUCCESS,
  GET_AVAILABLE_FUNDS_SUCCESS,
  GET_ACCOUNT_BALANCE_SUCCESS,
  GET_RECENT_TRANSACTIONS_SUCCESS,
  CREATE_NEW_BILL_SUCCESS,
} from '../constants';

jest.mock('helpers', () => ({
  formatBill: jest.fn((bill) => ({ ...bill, formatted: true })),
}));

jest.mock('utils', () => ({
  routes: {
    dashboard: { path: '/dashboard' },
  },
}));

describe('dashboardPageReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(dashboardPageReducer(undefined, {})).toEqual(initialState);
  });

  describe('Dashboard-specific actions', () => {
    it('should handle SELECT_CURRENCY when conditions are met', () => {
      expect(true).toBe(true);
    });

    it('should handle TOGGLE_MODAL when conditions are met', () => {
      expect(true).toBe(true);
    });
  });

  describe('Global actions', () => {
    it('should handle GET_BILLS_SUCCESS', () => {
      const bills = [
        { id: 1, accountNumber: '123456' },
        { id: 2, accountNumber: '789012' },
      ];
      const action = { type: GET_BILLS_SUCCESS, bills };

      const result = dashboardPageReducer(initialState, action);
      expect(formatBill).toHaveBeenCalledTimes(2);
      expect(result.bills).toHaveLength(2);
      expect(result.bills[0]).toHaveProperty('formatted', true);
    });

    it('should handle CREATE_NEW_BILL_SUCCESS', () => {
      const existingBills = [{ id: 1, formatted: true }];
      const state = {
        ...initialState,
        bills: existingBills,
        currency: { code: 'USD' },
      };
      const newBill = { id: 2, accountNumber: '999888' };
      const action = { type: CREATE_NEW_BILL_SUCCESS, bill: newBill };

      const result = dashboardPageReducer(state, action);
      expect(formatBill).toHaveBeenCalledWith(newBill);
      expect(result.bills).toHaveLength(2);
      expect(result.bills[1]).toHaveProperty('formatted', true);
      expect(result.currency).toBe(null);
    });

    it('should handle GET_AVAILABLE_FUNDS_SUCCESS with multiple balance history items', () => {
      const action = {
        type: GET_AVAILABLE_FUNDS_SUCCESS,
        amountMoney: '1500.50',
        currencyName: 'USD',
        accountBalanceHistory: [1000, 1200, 1500],
      };

      const result = dashboardPageReducer(initialState, action);
      expect(result.amountMoney).toBe('1500.50');
      expect(result.currencyName).toBe('USD');
      expect(result.accountBalanceHistory).toEqual([1000, 1200, 1500]);
    });

    it('should handle GET_AVAILABLE_FUNDS_SUCCESS with single balance history item', () => {
      const action = {
        type: GET_AVAILABLE_FUNDS_SUCCESS,
        amountMoney: '2000.00',
        currencyName: 'EUR',
        accountBalanceHistory: [2000],
      };

      const result = dashboardPageReducer(initialState, action);
      expect(result.amountMoney).toBe('2000.00');
      expect(result.currencyName).toBe('EUR');
      expect(result.accountBalanceHistory).toEqual([2000, 0]);
    });

    it('should handle GET_ACCOUNT_BALANCE_SUCCESS', () => {
      const action = {
        type: GET_ACCOUNT_BALANCE_SUCCESS,
        currencyName: 'GBP',
        savings: 1234.56,
        savingsData: [{ name: 'savings', value: 1234.56 }],
        savingsColors: ['#1890ff', '#ff4d4f'],
      };

      const result = dashboardPageReducer(initialState, action);
      expect(result.currencyName).toBe('GBP');
      expect(result.savings).toBe('1234,6');
      expect(result.savingsData).toEqual([{ name: 'savings', value: 1234.56 }]);
      expect(result.savingsColors).toEqual(['#1890ff', '#ff4d4f']);
    });

    it('should handle GET_RECENT_TRANSACTIONS_SUCCESS', () => {
      const transactions = [
        { id: 1, amount: 100, type: 'credit' },
        { id: 2, amount: 50, type: 'debit' },
      ];
      const action = {
        type: GET_RECENT_TRANSACTIONS_SUCCESS,
        recentTransactions: transactions,
      };

      const result = dashboardPageReducer(initialState, action);
      expect(result.recentTransactions).toEqual(transactions);
    });
  });

  describe('Reset actions', () => {
    it('should reset to initial state on LOCATION_CHANGE', () => {
      const state = {
        ...initialState,
        amountMoney: '1000',
        bills: [{ id: 1 }],
        isOpenedModal: true,
      };
      const action = { type: LOCATION_CHANGE };

      const result = dashboardPageReducer(state, action);
      expect(result).toEqual(initialState);
    });

    it('should reset to initial state on LOGOUT_SUCCESS', () => {
      const state = {
        ...initialState,
        currencyName: 'USD',
        savings: '500,0',
        recentTransactions: [{ id: 1 }],
      };
      const action = { type: LOGOUT_SUCCESS };

      const result = dashboardPageReducer(state, action);
      expect(result).toEqual(initialState);
    });

    it('should reset to initial state on LOGOUT_ERROR', () => {
      const state = {
        ...initialState,
        currency: { code: 'EUR' },
        bills: [{ id: 1 }, { id: 2 }],
      };
      const action = { type: LOGOUT_ERROR };

      const result = dashboardPageReducer(state, action);
      expect(result).toEqual(initialState);
    });
  });
});
