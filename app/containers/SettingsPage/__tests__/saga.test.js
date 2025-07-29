import { put } from 'redux-saga/effects';
import { notification } from 'antd';
import { setUserDataIncorrectAction } from '../actions';
import { getUserData, setUserData } from '../saga';

jest.mock('antd', () => ({
  notification: {
    success: jest.fn(),
  },
}));

jest.mock('utils', () => ({
  api: {
    users: jest.fn(() => 'http://api.test/users'),
  },
  request: jest.fn(),
  routes: {
    login: { path: '/login' },
  },
}));

describe('SettingsPage Saga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    it('should handle successful user data fetch', async () => {
      const mockUserData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };
      const mockToken = { accessToken: 'test-token' };

      const generator = getUserData();

      const selectEffect = generator.next().value;
      expect(selectEffect.type).toBe('SELECT');

      const callEffect = generator.next(mockToken).value;
      expect(callEffect.type).toBe('CALL');
      expect(callEffect.payload.args[0]).toBe('http://api.test/users');
      expect(callEffect.payload.args[1]).toEqual({
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' },
      });

      const putEffect = generator.next(mockUserData).value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/SettingsPage/GET_USER_DATA_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
    });

    it('should handle user data fetch error', async () => {
      const mockError = new Error('Network error');
      const mockToken = { accessToken: 'test-token' };

      const generator = getUserData();

      generator.next();
      generator.next(mockToken);

      const errorPutEffect = generator.throw(mockError).value;
      expect(errorPutEffect.type).toBe('PUT');
      expect(errorPutEffect.payload.action.type).toBe(
        'app/SettingsPage/GET_USER_DATA_ERROR',
      );

      const pushEffect = generator.next().value;
      expect(pushEffect.type).toBe('PUT');
      expect(pushEffect.payload.action.type).toBe(
        '@@router/CALL_HISTORY_METHOD',
      );

      expect(generator.next().done).toBe(true);
    });
  });

  describe('setUserData', () => {
    it('should handle successful user data update with collapsed sidebar', async () => {
      const mockUserData = {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      const mockToken = { accessToken: 'test-token' };
      const mockNewData = { name: 'Jane Doe' };
      const mockSnippets = {
        success: {
          title: 'Success',
          description: 'Data updated successfully',
        },
      };
      const isCollapsedSidebar = true;

      const generator = setUserData({ snippets: mockSnippets });

      const selectTokenEffect = generator.next().value;
      expect(selectTokenEffect.type).toBe('SELECT');

      const selectNewDataEffect = generator.next(mockToken).value;
      expect(selectNewDataEffect.type).toBe('SELECT');

      const selectSidebarEffect = generator.next(mockNewData).value;
      expect(selectSidebarEffect.type).toBe('SELECT');

      const callEffect = generator.next(isCollapsedSidebar).value;
      expect(callEffect.type).toBe('CALL');
      expect(callEffect.payload.args[0]).toBe('http://api.test/users');
      expect(callEffect.payload.args[1]).toEqual({
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(mockNewData),
      });

      const putEffect = generator.next(mockUserData).value;
      expect(putEffect.type).toBe('PUT');
      expect(putEffect.payload.action.type).toBe(
        'app/SettingsPage/SET_USER_DATA_SUCCESS',
      );

      expect(generator.next().done).toBe(true);
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Success',
        description: 'Data updated successfully',
        style: { width: 400, marginLeft: 80 },
        placement: 'bottomLeft',
      });
    });

    it('should handle successful user data update with expanded sidebar', async () => {
      const mockUserData = {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      const mockToken = { accessToken: 'test-token' };
      const mockNewData = { name: 'Jane Doe' };
      const mockSnippets = {
        success: {
          title: 'Success',
          description: 'Data updated successfully',
        },
      };
      const isCollapsedSidebar = false;

      const generator = setUserData({ snippets: mockSnippets });

      generator.next();
      generator.next(mockToken);
      generator.next(mockNewData);
      generator.next(isCollapsedSidebar);
      generator.next(mockUserData);
      generator.next();

      expect(notification.success).toHaveBeenCalledWith({
        message: 'Success',
        description: 'Data updated successfully',
        style: { width: 400, marginLeft: 250 },
        placement: 'bottomLeft',
      });
    });

    it('should handle user data update error', async () => {
      const mockError = new Error('Update failed');
      const mockToken = { accessToken: 'test-token' };
      const mockNewData = { name: 'Jane Doe' };
      const mockSnippets = {
        success: {
          title: 'Success',
          description: 'Data updated successfully',
        },
      };
      const isCollapsedSidebar = true;

      const generator = setUserData({ snippets: mockSnippets });

      generator.next();
      generator.next(mockToken);
      generator.next(mockNewData);
      generator.next(isCollapsedSidebar);
      expect(generator.throw(mockError).value).toEqual(
        put(setUserDataIncorrectAction(mockError)),
      );
      expect(generator.next().done).toBe(true);
    });
  });
});
