import {
  getAvailableFundsAction as loadDashboardDataAction,
  getAvailableFundsSuccessAction as loadDashboardDataSuccessAction,
  getAvailableFundsErrorAction as loadDashboardDataErrorAction,
  getAvailableFundsAction as updateAvailableFundsAction,
} from '../actions';
import dashboardPageReducer from '../reducer';
import {
  makeSelectAmountMoney as selectAvailableFunds,
  makeSelectBills as selectBills,
  selectDashboardPageDomain as selectIsLoading,
} from '../selectors';

describe('DashboardPage Redux', () => {
  describe('Action Creators', () => {
    it('should create load dashboard data action', () => {
      const expectedAction = {
        type: 'LOAD_DASHBOARD_DATA',
      };

      expect(loadDashboardDataAction()).toEqual(expectedAction);
    });

    it('should create load dashboard data success action', () => {
      const payload = {
        availableFunds: 5000,
        bills: [],
        transactions: [],
      };

      const expectedAction = {
        type: 'LOAD_DASHBOARD_DATA_SUCCESS',
        payload,
      };

      expect(loadDashboardDataSuccessAction(payload)).toEqual(expectedAction);
    });

    it('should create load dashboard data error action', () => {
      const error = 'Failed to load data';

      const expectedAction = {
        type: 'LOAD_DASHBOARD_DATA_ERROR',
        error,
      };

      expect(loadDashboardDataErrorAction(error)).toEqual(expectedAction);
    });

    it('should create update available funds action', () => {
      const amount = 1500.5;

      const expectedAction = {
        type: 'UPDATE_AVAILABLE_FUNDS',
        amount,
      };

      expect(updateAvailableFundsAction(amount)).toEqual(expectedAction);
    });
  });

  describe('Reducer', () => {
    const initialState = {
      availableFunds: 0,
      savings: 0,
      bills: [],
      recentTransactions: [],
      bankCards: [],
      credits: [],
      deposits: [],
      isLoading: false,
      error: null,
    };

    it('should return initial state', () => {
      expect(dashboardPageReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle LOAD_DASHBOARD_DATA', () => {
      const action = {
        type: 'LOAD_DASHBOARD_DATA',
      };

      const expectedState = {
        ...initialState,
        isLoading: true,
        error: null,
      };

      expect(dashboardPageReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle LOAD_DASHBOARD_DATA_SUCCESS', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const payload = {
        availableFunds: 5000.5,
        savings: 2500.75,
        bills: [{ id: 1, title: 'Test Bill' }],
        recentTransactions: [{ id: 1, title: 'Test Transaction' }],
        bankCards: [{ id: 1, cardNumber: '1234' }],
        credits: [{ id: 1, title: 'Test Credit' }],
        deposits: [{ id: 1, title: 'Test Deposit' }],
      };

      const action = {
        type: 'LOAD_DASHBOARD_DATA_SUCCESS',
        payload,
      };

      const expectedState = {
        ...initialState,
        ...payload,
        isLoading: false,
        error: null,
      };

      expect(dashboardPageReducer(loadingState, action)).toEqual(expectedState);
    });

    it('should handle LOAD_DASHBOARD_DATA_ERROR', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const error = 'Failed to load dashboard data';

      const action = {
        type: 'LOAD_DASHBOARD_DATA_ERROR',
        error,
      };

      const expectedState = {
        ...initialState,
        isLoading: false,
        error,
      };

      expect(dashboardPageReducer(loadingState, action)).toEqual(expectedState);
    });

    it('should handle UPDATE_AVAILABLE_FUNDS', () => {
      const currentState = {
        ...initialState,
        availableFunds: 1000,
      };

      const amount = 500.25;

      const action = {
        type: 'UPDATE_AVAILABLE_FUNDS',
        amount,
      };

      const expectedState = {
        ...currentState,
        availableFunds: amount,
      };

      expect(dashboardPageReducer(currentState, action)).toEqual(expectedState);
    });

    it('should handle unknown action types', () => {
      const action = {
        type: 'UNKNOWN_ACTION',
        payload: 'test',
      };

      expect(dashboardPageReducer(initialState, action)).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const mockState = {
      dashboardPage: {
        availableFunds: 5000.5,
        savings: 2500.75,
        bills: [
          { id: 1, title: 'Electricity Bill', amountMoney: 150.75 },
          { id: 2, title: 'Water Bill', amountMoney: 85.5 },
        ],
        recentTransactions: [
          { id: 1, title: 'Coffee Shop', amountMoney: -4.5 },
        ],
        isLoading: false,
        error: null,
      },
    };

    it('should select available funds', () => {
      expect(selectAvailableFunds(mockState)).toBe(5000.5);
    });

    it('should select bills', () => {
      const expectedBills = [
        { id: 1, title: 'Electricity Bill', amountMoney: 150.75 },
        { id: 2, title: 'Water Bill', amountMoney: 85.5 },
      ];

      expect(selectBills(mockState)).toEqual(expectedBills);
    });

    it('should select loading state', () => {
      expect(selectIsLoading(mockState)).toBe(false);
    });

    it('should handle empty state', () => {
      const emptyState = {
        dashboardPage: {
          availableFunds: 0,
          bills: [],
          isLoading: true,
        },
      };

      expect(selectAvailableFunds(emptyState)).toBe(0);
      expect(selectBills(emptyState)).toEqual([]);
      expect(selectIsLoading(emptyState)).toBe(true);
    });

    it('should memoize selector results', () => {
      const result1 = selectBills(mockState);
      const result2 = selectBills(mockState);

      expect(result1).toBe(result2);
    });
  });

  describe('State Transformations', () => {
    it('should maintain immutability in reducer', () => {
      const currentState = {
        availableFunds: 1000,
        bills: [{ id: 1, title: 'Test' }],
        isLoading: false,
      };

      const action = {
        type: 'UPDATE_AVAILABLE_FUNDS',
        amount: 2000,
      };

      const newState = dashboardPageReducer(currentState, action);

      expect(newState).not.toBe(currentState);
      expect(newState.bills).toBe(currentState.bills);
      expect(newState.availableFunds).toBe(2000);
    });

    it('should handle nested state updates correctly', () => {
      const currentState = {
        availableFunds: 1000,
        bills: [{ id: 1, title: 'Old Bill' }],
        isLoading: false,
      };

      const newBills = [
        { id: 1, title: 'Updated Bill' },
        { id: 2, title: 'New Bill' },
      ];

      const action = {
        type: 'LOAD_DASHBOARD_DATA_SUCCESS',
        payload: {
          bills: newBills,
          availableFunds: 1500,
        },
      };

      const newState = dashboardPageReducer(currentState, action);

      expect(newState.bills).toEqual(newBills);
      expect(newState.bills).not.toBe(currentState.bills);
      expect(newState.availableFunds).toBe(1500);
    });
  });
});
