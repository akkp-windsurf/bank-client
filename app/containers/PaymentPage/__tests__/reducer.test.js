import { LOCATION_CHANGE } from 'connected-react-router';
import paymentPageReducer, { initialState } from '../reducer';
import { LOGOUT_SUCCESS, LOGOUT_ERROR } from '../../App/constants';
import {
  SELECT_SENDER_BILL,
  GET_BILLS_SUCCESS,
  SEARCH_RECIPIENT_SUCCESS,
  GET_AUTHORIZATION_KEY_SUCCESS,
  CREATE_TRANSACTION_SUCCESS,
  CONFIRM_TRANSACTION_SUCCESS,
} from '../constants';

describe('paymentPageReducer', () => {
  it('should return the initial state', () => {
    expect(paymentPageReducer(undefined, {})).toEqual(initialState);
  });

  describe('Global actions', () => {
    it('should handle GET_AUTHORIZATION_KEY_SUCCESS', () => {
      const action = {
        type: GET_AUTHORIZATION_KEY_SUCCESS,
        authorizationKey: 'auth-key-123',
      };

      const result = paymentPageReducer(initialState, action);
      expect(result.authorizationKey).toBe('auth-key-123');
    });

    it('should handle GET_BILLS_SUCCESS', () => {
      const bills = [
        { accountBillNumber: '1234567890123456', availableFunds: 1000 },
        { accountBillNumber: '9876543210987654', availableFunds: 2000 },
      ];
      const action = {
        type: GET_BILLS_SUCCESS,
        bills,
      };

      const result = paymentPageReducer(initialState, action);
      expect(result.bills).toHaveLength(2);
      expect(result.bills[0]).toHaveProperty('accountBillNumber');
    });

    it('should handle SEARCH_RECIPIENT_SUCCESS', () => {
      const recipients = [
        { accountBillNumber: '1111222233334444', name: 'John Doe' },
        { accountBillNumber: '5555666677778888', name: 'Jane Smith' },
      ];
      const action = {
        type: SEARCH_RECIPIENT_SUCCESS,
        recipients,
      };

      const result = paymentPageReducer(initialState, action);
      expect(result.recipients).toHaveLength(2);
      expect(result.recipients[0]).toHaveProperty('accountBillNumber');
    });

    it('should handle SELECT_SENDER_BILL', () => {
      const bills = [
        { uuid: 'bill-1', accountBillNumber: '1234567890123456' },
        { uuid: 'bill-2', accountBillNumber: '9876543210987654' },
      ];
      const state = { ...initialState, bills };
      const action = {
        type: SELECT_SENDER_BILL,
        uuid: 'bill-2',
      };

      const result = paymentPageReducer(state, action);
      expect(result.senderBill).toEqual(bills[1]);
    });

    it('should handle SELECT_SENDER_BILL with no match', () => {
      const bills = [{ uuid: 'bill-1', accountBillNumber: '1234567890123456' }];
      const state = { ...initialState, bills };
      const action = {
        type: SELECT_SENDER_BILL,
        uuid: 'non-existent-uuid',
      };

      const result = paymentPageReducer(state, action);
      expect(result.senderBill).toBe('');
    });

    it('should handle CREATE_TRANSACTION_SUCCESS', () => {
      const action = {
        type: CREATE_TRANSACTION_SUCCESS,
        uuid: 'transaction-123',
      };

      const result = paymentPageReducer(initialState, action);
      expect(result.hasCreatedTransaction).toBe(true);
      expect(result.transaction).toBe('transaction-123');
    });

    it('should handle CONFIRM_TRANSACTION_SUCCESS', () => {
      const action = { type: CONFIRM_TRANSACTION_SUCCESS };

      const result = paymentPageReducer(initialState, action);
      expect(result.hasConfirmedTransaction).toBe(true);
    });
  });

  describe('Reset actions', () => {
    it('should reset to initial state on LOGOUT_SUCCESS', () => {
      const state = {
        ...initialState,
        currentStep: 2,
        hasCreatedTransaction: true,
        transaction: 'test-transaction',
      };
      const action = { type: LOGOUT_SUCCESS };

      const result = paymentPageReducer(state, action);
      expect(result).toEqual(initialState);
    });

    it('should reset to initial state on LOGOUT_ERROR', () => {
      const state = {
        ...initialState,
        currentStep: 1,
        authorizationKey: 'test-key',
      };
      const action = { type: LOGOUT_ERROR };

      const result = paymentPageReducer(state, action);
      expect(result).toEqual(initialState);
    });

    it('should reset to initial state on LOCATION_CHANGE', () => {
      const state = {
        ...initialState,
        currentStep: 3,
        hasConfirmedTransaction: true,
      };
      const action = { type: LOCATION_CHANGE };

      const result = paymentPageReducer(state, action);
      expect(result).toEqual(initialState);
    });
  });
});
