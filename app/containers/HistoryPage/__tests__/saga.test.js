import { saveAs } from 'file-saver';
import { getTransactionHistory, getConfirmationFile } from '../saga';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('utils', () => {
  const mockTransactions = jest.fn(() => `http://api.test/transactions`);
  const mockConfirmationFile = jest.fn(
    (uuid, locale) =>
      `http://api.test/transactions/confirmation/${uuid}?locale=${locale}`,
  );

  mockTransactions.mockImplementation((type) => {
    if (type === 'confirmationFile') {
      return mockConfirmationFile;
    }
    return `http://api.test/transactions`;
  });

  return {
    api: {
      transactions: mockTransactions,
    },
    request: jest.fn(),
    routes: {
      login: { path: '/login' },
    },
  };
});

describe('HistoryPage Saga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionHistory', () => {
    it('should handle successful transaction history fetch', async () => {
      const mockTransactions = { data: [{ id: 1, amount: 100 }] };
      const mockToken = { accessToken: 'test-token' };

      const generator = getTransactionHistory({ currentPage: 1 });

      const selectEffect = generator.next().value;
      expect(selectEffect.type).toBe('SELECT');

      const callEffect = generator.next(mockToken).value;
      expect(callEffect.type).toBe('CALL');
      expect(callEffect.payload.args[0]).toContain('?page=1&order=DESC');
      expect(callEffect.payload.args[1]).toEqual({
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' },
      });

      const putEffect = generator.next(mockTransactions).value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/HistoryPage/GET_TRANSACTION_HISTORY_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
    });

    it('should handle transaction history fetch error', async () => {
      const mockError = new Error('Network error');
      const mockToken = { accessToken: 'test-token' };

      const generator = getTransactionHistory({ currentPage: 1 });

      generator.next();
      generator.next(mockToken);

      const errorPutEffect = generator.throw(mockError).value;
      expect(errorPutEffect.type).toBe('PUT');
      expect(errorPutEffect.payload.action.type).toBe(
        'app/HistoryPage/GET_TRANSACTION_HISTORY_ERROR',
      );

      const pushEffect = generator.next().value;
      expect(pushEffect.type).toBe('PUT');
      expect(pushEffect.payload.action.type).toBe(
        '@@router/CALL_HISTORY_METHOD',
      );

      expect(generator.next().done).toBe(true);
    });
  });

  describe('getConfirmationFile', () => {
    it('should handle successful confirmation file download', async () => {
      const mockResponse = new ArrayBuffer(8);
      const mockToken = { accessToken: 'test-token' };
      const mockLocale = 'en';
      const uuid = 'test-uuid';

      const generator = getConfirmationFile({ uuid });

      const selectLocaleEffect = generator.next().value;
      expect(selectLocaleEffect.type).toBe('SELECT');

      const selectTokenEffect = generator.next(mockLocale).value;
      expect(selectTokenEffect.type).toBe('SELECT');

      const requestCall = generator.next(mockToken).value;
      expect(requestCall.type).toBe('CALL');
      expect(requestCall.payload.args[1]).toEqual({
        responseType: 'blob',
        headers: { Authorization: 'Bearer test-token' },
      });
      expect(requestCall.payload.args[2]).toBe(false);

      const putEffect = generator.next(mockResponse).value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/HistoryPage/GET_CONFIRMATION_FILE_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'test-uuid.pdf');
    });

    it('should handle confirmation file download error', async () => {
      const mockError = new Error('Download failed');
      const mockToken = { accessToken: 'test-token' };
      const mockLocale = 'en';
      const uuid = 'test-uuid';

      const generator = getConfirmationFile({ uuid });

      generator.next();
      generator.next(mockLocale);
      generator.next(mockToken);

      const errorPutEffect = generator.throw(mockError).value;
      expect(errorPutEffect.type).toBe('PUT');
      expect(errorPutEffect.payload.action.type).toBe(
        'app/HistoryPage/GET_CONFIRMATION_FILE_ERROR',
      );

      const pushEffect = generator.next().value;
      expect(pushEffect.type).toBe('PUT');
      expect(pushEffect.payload.action.type).toBe(
        '@@router/CALL_HISTORY_METHOD',
      );

      expect(generator.next().done).toBe(true);
    });
  });
});
