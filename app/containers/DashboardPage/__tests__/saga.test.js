import { runSaga } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import request from '../../../utils/request';
import watchLoadDashboardData, {
  getAvailableFunds as loadDashboardDataSaga,
} from '../saga';
import {
  getAvailableFundsSuccessAction as loadDashboardDataSuccessAction,
  getAvailableFundsErrorAction as loadDashboardDataErrorAction,
} from '../actions';

describe('DashboardPage Saga', () => {
  describe('loadDashboardDataSaga', () => {
    it('should load dashboard data successfully', async () => {
      const mockResponse = {
        availableFunds: 5000.5,
        savings: 2500.75,
        bills: [{ id: 1, title: 'Electricity Bill', amountMoney: 150.75 }],
        recentTransactions: [
          { id: 1, title: 'Coffee Shop', amountMoney: -4.5 },
        ],
        bankCards: [
          { id: 1, cardNumber: '1234567890123456', cardType: 'VISA' },
        ],
        credits: [{ id: 1, title: 'Personal Loan', amountMoney: 10000 }],
        deposits: [{ id: 1, title: 'Savings Account', amountMoney: 15000 }],
      };

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loadDashboardDataSaga,
      );

      const mockRequest = jest.fn().mockResolvedValue(mockResponse);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        loadDashboardDataSuccessAction(mockResponse),
      );
    });

    it('should handle dashboard data loading error', async () => {
      const error = new Error('Failed to load dashboard data');

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loadDashboardDataSaga,
      );

      const mockRequest = jest.fn().mockRejectedValue(error);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        loadDashboardDataErrorAction(error.message),
      );
    });

    it('should make correct API calls', async () => {
      const mockRequest = jest.fn().mockResolvedValue({});

      const saga = runSaga(
        {
          dispatch: () => {},
          getState: () => ({}),
        },
        loadDashboardDataSaga,
      );

      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(mockRequest).toHaveBeenCalledWith('/api/dashboard', {
        method: 'GET',
      });
    });
  });

  describe('watchLoadDashboardData', () => {
    it('should watch for LOAD_DASHBOARD_DATA action', () => {
      const generator = watchLoadDashboardData();
      const expected = takeEvery('LOAD_DASHBOARD_DATA', loadDashboardDataSaga);

      expect(generator.next().value).toEqual(expected);
    });
  });

  describe('Saga Effects', () => {
    it('should use correct saga effects', () => {
      const generator = loadDashboardDataSaga();

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(
        call(request, '/api/dashboard', { method: 'GET' }),
      );

      const mockResponse = { data: 'test' };
      const putEffect = generator.next(mockResponse).value;
      expect(putEffect).toEqual(
        put(loadDashboardDataSuccessAction(mockResponse)),
      );
    });

    it('should handle saga errors correctly', () => {
      const generator = loadDashboardDataSaga();

      generator.next();

      const error = new Error('API Error');
      const putEffect = generator.throw(error).value;

      expect(putEffect).toEqual(
        put(loadDashboardDataErrorAction(error.message)),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.name = 'NetworkError';

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loadDashboardDataSaga,
      );

      const mockRequest = jest.fn().mockRejectedValue(networkError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        loadDashboardDataErrorAction('Network Error'),
      );
    });

    it('should handle API errors with status codes', async () => {
      const apiError = new Error('Unauthorized');
      apiError.status = 401;

      const dispatched = [];
      const saga = runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({}),
        },
        loadDashboardDataSaga,
      );

      const mockRequest = jest.fn().mockRejectedValue(apiError);
      jest.doMock('../../../utils/request', () => ({
        request: mockRequest,
      }));

      await saga.toPromise();

      expect(dispatched).toContainEqual(
        loadDashboardDataErrorAction('Unauthorized'),
      );
    });
  });
});
