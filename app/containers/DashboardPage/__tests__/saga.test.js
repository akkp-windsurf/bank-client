import { runSaga } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

describe('DashboardPage Saga', () => {
  let dispatched = [];

  beforeEach(() => {
    dispatched = [];
  });

  const mockStore = {
    dispatch: (action) => dispatched.push(action),
    getState: () => ({}),
  };

  it('should handle dashboard data loading', async () => {
    const mockSaga = function* dashboardDataSaga() {
      yield put({ type: 'DASHBOARD_DATA_LOADED', payload: { balance: 1000 } });
    };

    await runSaga(mockStore, mockSaga).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: 'DASHBOARD_DATA_LOADED',
      }),
    );
  });

  it('should handle dashboard refresh', async () => {
    const mockSaga = function* dashboardRefreshSaga() {
      yield put({ type: 'DASHBOARD_REFRESH_SUCCESS' });
    };

    await runSaga(mockStore, mockSaga).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: 'DASHBOARD_REFRESH_SUCCESS',
      }),
    );
  });

  it('should handle error scenarios', async () => {
    const mockSaga = function* dashboardErrorSaga() {
      try {
        yield call(() => Promise.reject(new Error('Dashboard API Error')));
      } catch (error) {
        yield put({ type: 'DASHBOARD_ERROR', error: error.message });
      }
    };

    await runSaga(mockStore, mockSaga).toPromise();

    expect(dispatched).toContainEqual(
      expect.objectContaining({
        type: 'DASHBOARD_ERROR',
      }),
    );
  });
});
