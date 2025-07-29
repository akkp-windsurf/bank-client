import { loadState, saveState } from '../index';

describe('PersistStore utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loadState', () => {
    it('should return undefined when no state exists', () => {
      const result = loadState();
      expect(result).toBeUndefined();
    });

    it('should return parsed state when valid state exists', () => {
      const testState = { user: { name: 'Test User' } };
      localStorage.setItem('bankapp_state', JSON.stringify(testState));

      const result = loadState();
      expect(result).toEqual(testState);
    });

    it('should return undefined when invalid JSON exists', () => {
      localStorage.setItem('bankapp_state', 'invalid json');

      const result = loadState();
      expect(result).toBeUndefined();
    });
  });

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const testState = { user: { name: 'Test User' } };

      saveState(testState);

      const saved = localStorage.getItem('bankapp_state');
      expect(JSON.parse(saved)).toEqual(testState);
    });

    it('should return undefined when JSON.stringify fails', () => {
      const circularState = {};
      circularState.self = circularState;

      const result = saveState(circularState);
      expect(result).toBeUndefined();
    });
  });
});
