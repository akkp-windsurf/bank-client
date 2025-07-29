import { LOGIN_SUCCESS } from 'containers/LoginPage/constants';
import { CHANGE_LAYOUT } from 'containers/DashboardPage/constants';
import { LOCATION_CHANGE } from 'connected-react-router';
import { LOGIN_EXPRESS_SUCCESS } from 'containers/RegisterPage/constants';
import { SET_USER_DATA_SUCCESS } from 'containers/SettingsPage/constants';
import appReducer, { initialState } from '../reducer';
import {
  LOGOUT_SUCCESS,
  COLLAPSED_SIDEBAR,
  COLLAPSED_DRAWER,
  GET_CURRENCIES_SUCCESS,
  LOGOUT_ERROR,
  GET_MESSAGES_SUCCESS,
  OPEN_MESSAGE_MODAL,
  CLOSE_MESSAGE_MODAL,
  GET_NOTIFICATIONS_SUCCESS,
  READ_MESSAGE_SUCCESS,
  READ_ALL_MESSAGES_SUCCESS,
  TOGGLE_CONFIRM_MODAL,
} from '../constants';

describe('appReducer', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(initialState);
  });

  it('should reset to initial state on any error action', () => {
    const state = {
      ...initialState,
      isLogged: true,
      user: { name: 'Test User' },
    };
    const action = { type: 'SOME_ACTION_ERROR' };

    expect(appReducer(state, action)).toEqual(initialState);
  });

  describe('LOGIN_SUCCESS', () => {
    it('should handle login success', () => {
      const user = { id: 1, name: 'John Doe' };
      const token = { accessToken: 'test-token' };
      const action = { type: LOGIN_SUCCESS, user, token };

      const result = appReducer(initialState, action);
      expect(result.isLogged).toBe(true);
      expect(result.user).toEqual(user);
      expect(result.token).toEqual(token);
    });
  });

  describe('LOGIN_EXPRESS_SUCCESS', () => {
    it('should handle express login success', () => {
      const user = { id: 2, name: 'Jane Doe' };
      const token = { accessToken: 'express-token' };
      const action = { type: LOGIN_EXPRESS_SUCCESS, user, token };

      const result = appReducer(initialState, action);
      expect(result.isLogged).toBe(true);
      expect(result.user).toEqual(user);
      expect(result.token).toEqual(token);
    });
  });

  describe('COLLAPSED_SIDEBAR', () => {
    it('should toggle sidebar collapsed state', () => {
      const action = { type: COLLAPSED_SIDEBAR };

      const result1 = appReducer(initialState, action);
      expect(result1.isCollapsedSidebar).toBe(true);

      const result2 = appReducer(result1, action);
      expect(result2.isCollapsedSidebar).toBe(false);
    });
  });

  describe('COLLAPSED_DRAWER', () => {
    it('should toggle drawer collapsed state', () => {
      const action = { type: COLLAPSED_DRAWER };

      const result1 = appReducer(initialState, action);
      expect(result1.isCollapsedDrawer).toBe(true);

      const result2 = appReducer(result1, action);
      expect(result2.isCollapsedDrawer).toBe(false);
    });
  });

  describe('CHANGE_LAYOUT', () => {
    it('should update layout', () => {
      const layout = { width: 1200, height: 800 };
      const action = { type: CHANGE_LAYOUT, layout };

      const result = appReducer(initialState, action);
      expect(result.layout).toEqual(layout);
    });
  });

  describe('SET_USER_DATA_SUCCESS', () => {
    it('should update user data', () => {
      const userData = {
        id: 1,
        name: 'Updated User',
        email: 'updated@test.com',
      };
      const action = { type: SET_USER_DATA_SUCCESS, userData };

      const result = appReducer(initialState, action);
      expect(result.user).toEqual(userData);
    });
  });

  describe('TOGGLE_CONFIRM_MODAL', () => {
    it('should toggle confirm modal state', () => {
      const action = { type: TOGGLE_CONFIRM_MODAL };

      const result1 = appReducer(initialState, action);
      expect(result1.isOpenedModal).toBe(true);

      const result2 = appReducer(result1, action);
      expect(result2.isOpenedModal).toBe(false);
    });
  });

  describe('GET_CURRENCIES_SUCCESS', () => {
    it('should update currencies', () => {
      const currencies = [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
      ];
      const action = { type: GET_CURRENCIES_SUCCESS, data: currencies };

      const result = appReducer(initialState, action);
      expect(result.currencies).toEqual(currencies);
    });
  });

  describe('GET_MESSAGES_SUCCESS', () => {
    it('should update messages', () => {
      const messages = [
        { id: 1, content: 'Message 1', readed: false },
        { id: 2, content: 'Message 2', readed: true },
      ];
      const action = { type: GET_MESSAGES_SUCCESS, data: messages };

      const result = appReducer(initialState, action);
      expect(result.messages).toEqual(messages);
    });
  });

  describe('GET_NOTIFICATIONS_SUCCESS', () => {
    it('should update notifications and reset notification count', () => {
      const notifications = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
      ];
      const state = {
        ...initialState,
        user: { userConfig: { notificationCount: 5 } },
      };
      const action = { type: GET_NOTIFICATIONS_SUCCESS, data: notifications };

      const result = appReducer(state, action);
      expect(result.notifications).toEqual(notifications);
      expect(result.user.userConfig.notificationCount).toBe(0);
    });

    it('should update notifications without notification count', () => {
      const notifications = [{ id: 1, message: 'Notification 1' }];
      const state = {
        ...initialState,
        user: { userConfig: {} },
      };
      const action = { type: GET_NOTIFICATIONS_SUCCESS, data: notifications };

      const result = appReducer(state, action);
      expect(result.notifications).toEqual(notifications);
    });
  });

  describe('OPEN_MESSAGE_MODAL', () => {
    it('should open message modal with uuid', () => {
      const uuid = 'message-123';
      const action = { type: OPEN_MESSAGE_MODAL, uuid };

      const result = appReducer(initialState, action);
      expect(result.isOpenedMessage).toBe(true);
      expect(result.openedMessage).toBe(uuid);
    });
  });

  describe('READ_MESSAGE_SUCCESS', () => {
    it('should mark message as read and decrement message count', () => {
      const messages = {
        data: [
          { uuid: 'msg-1', content: 'Message 1', readed: false },
          { uuid: 'msg-2', content: 'Message 2', readed: false },
        ],
      };
      const state = {
        ...initialState,
        messages,
        openedMessage: 'msg-1',
        user: { userConfig: { messageCount: 3 } },
      };
      const action = { type: READ_MESSAGE_SUCCESS };

      const result = appReducer(state, action);
      expect(result.messages.data[0].readed).toBe(true);
      expect(result.messages.data[1].readed).toBe(false);
      expect(result.user.userConfig.messageCount).toBe(2);
    });

    it('should mark message as read without message count', () => {
      const messages = {
        data: [{ uuid: 'msg-1', content: 'Message 1', readed: false }],
      };
      const state = {
        ...initialState,
        messages,
        openedMessage: 'msg-1',
        user: { userConfig: {} },
      };
      const action = { type: READ_MESSAGE_SUCCESS };

      const result = appReducer(state, action);
      expect(result.messages.data[0].readed).toBe(true);
    });
  });

  describe('READ_ALL_MESSAGES_SUCCESS', () => {
    it('should mark all messages as read and reset message count', () => {
      const messages = {
        data: [
          { uuid: 'msg-1', content: 'Message 1', readed: false },
          { uuid: 'msg-2', content: 'Message 2', readed: false },
        ],
      };
      const state = {
        ...initialState,
        messages,
        user: { userConfig: { messageCount: 2 } },
      };
      const action = { type: READ_ALL_MESSAGES_SUCCESS };

      const result = appReducer(state, action);
      expect(result.messages.data[0].readed).toBe(true);
      expect(result.messages.data[1].readed).toBe(true);
      expect(result.user.userConfig.messageCount).toBe(0);
    });

    it('should mark all messages as read without message count', () => {
      const messages = {
        data: [{ uuid: 'msg-1', content: 'Message 1', readed: false }],
      };
      const state = {
        ...initialState,
        messages,
        user: { userConfig: {} },
      };
      const action = { type: READ_ALL_MESSAGES_SUCCESS };

      const result = appReducer(state, action);
      expect(result.messages.data[0].readed).toBe(true);
    });
  });

  describe('CLOSE_MESSAGE_MODAL', () => {
    it('should close message modal', () => {
      const state = {
        ...initialState,
        isOpenedMessage: true,
        openedMessage: 'msg-123',
      };
      const action = { type: CLOSE_MESSAGE_MODAL };

      const result = appReducer(state, action);
      expect(result.isOpenedMessage).toBe(false);
      expect(result.openedMessage).toBe('');
    });
  });

  describe('LOCATION_CHANGE', () => {
    it('should reset drawer and message modal state', () => {
      const state = {
        ...initialState,
        isCollapsedDrawer: true,
        isOpenedMessage: true,
        openedMessage: 'msg-123',
      };
      const action = { type: LOCATION_CHANGE };

      const result = appReducer(state, action);
      expect(result.isCollapsedDrawer).toBe(false);
      expect(result.isOpenedMessage).toBe(false);
      expect(result.openedMessage).toBe('');
    });
  });

  describe('LOGOUT_SUCCESS and LOGOUT_ERROR', () => {
    it('should reset to initial state on logout success', () => {
      const state = {
        ...initialState,
        isLogged: true,
        user: { name: 'Test User' },
        token: { accessToken: 'test-token' },
      };
      const action = { type: LOGOUT_SUCCESS };

      const result = appReducer(state, action);
      expect(result).toEqual(initialState);
    });

    it('should reset to initial state on logout error', () => {
      const state = {
        ...initialState,
        isLogged: true,
        user: { name: 'Test User' },
      };
      const action = { type: LOGOUT_ERROR };

      const result = appReducer(state, action);
      expect(result).toEqual(initialState);
    });
  });
});
