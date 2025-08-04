import { takeLatest, call, put, select, delay } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { api, request, routes } from 'utils';
import { push } from 'connected-react-router';
import {
  makeSelectToken,
  makeSelectOpenedMessage,
  makeSelectMessages,
  makeSelectUser,
} from 'containers/App/selectors';
import { emailValidation } from 'helpers';
import {
  LOGOUT_REQUEST,
  GET_CURRENCIES_REQUEST,
  CHECK_EMAIL_REQUEST,
  GET_MESSAGES_REQUEST,
  READ_ALL_MESSAGES_REQUEST,
  OPEN_MESSAGE_MODAL,
  GET_NOTIFICATIONS_REQUEST,
} from './constants';
import {
  logoutSuccessAction,
  logoutErrorAction,
  getCurrenciesSuccessAction,
  getCurrenciesErrorAction,
  checkEmailSuccessAction,
  checkEmailErrorAction,
  checkEmailInvalidAction,
  getMessagesSuccessAction,
  getMessagesErrorAction,
  readAllMessagesSuccessAction,
  readAllMessagesErrorAction,
  readMessageSuccessAction,
  readMessageErrorAction,
  readMessageAction,
  getNotificationsSuccessAction,
  getNotificationsErrorAction,
} from './actions';
import messages from './messages';
import {
  CurrencyResponse,
  MessagesResponse,
  NotificationsResponse,
  CheckEmailResponse,
  ApiError,
  RequestOptions,
} from '../../types/api';

interface CheckEmailAction {
  type: string;
  value: string;
  reject: () => void;
  resolve: () => void;
}

interface OpenMessageModalAction {
  type: string;
  uuid: string;
}

export function* logout(): SagaIterator {
  const { accessToken }: { accessToken: string } = yield select(makeSelectToken());
  const requestURL: string = api.auth.logout;
  const requestParameters: RequestOptions = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    yield call(request, requestURL, requestParameters);
    yield put(logoutSuccessAction());
    yield put(push(routes.home.path));
  } catch (error: any) {
    yield put(logoutErrorAction(error));

    switch (error.statusCode) {
      case 401:
        yield put(push(routes.home.path));
        break;
      default:
        yield put(push(routes.login.path));
        break;
    }
  }
}

export function* getCurrencies(): SagaIterator {
  const requestURL: string = api.currencies;

  try {
    const response: CurrencyResponse = yield call(request, requestURL);
    yield put(getCurrenciesSuccessAction(response.data));
  } catch (error: any) {
    yield put(getCurrenciesErrorAction(messages.serverError));
  }
}

export function* checkEmail({ value, reject, resolve }: CheckEmailAction): SagaIterator {
  const requestURL: string = (api.users as any)('checkEmail')(value);

  if (!value) {
    yield call(resolve);
  }

  if (emailValidation(value)) {
    try {
      yield delay(400);
      const response: CheckEmailResponse = yield call(request, requestURL);
      yield put(checkEmailSuccessAction());

      if (response.exist) {
        yield call(reject);
      } else {
        yield call(resolve);
      }
    } catch (error: any) {
      yield put(checkEmailErrorAction(messages.serverError));
    }
  } else {
    yield put(checkEmailInvalidAction());
    yield call(resolve);
  }
}

export function* getMessages(): SagaIterator {
  const { accessToken }: { accessToken: string } = yield select(makeSelectToken());
  const requestURL: string = api.messages;
  const requestParameters: RequestOptions = {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  try {
    const response: MessagesResponse = yield call(request, requestURL, requestParameters);
    yield put(getMessagesSuccessAction(response));
  } catch (error: any) {
    yield put(getMessagesErrorAction(error));
    yield put(push(routes.login.path));
  }
}

export function* readAllMessages(): SagaIterator {
  const { accessToken }: { accessToken: string } = yield select(makeSelectToken());
  const requestURL: string = api.messages;
  const requestParameters: RequestOptions = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    yield call(request, requestURL, requestParameters);
    yield put(readAllMessagesSuccessAction());
  } catch (error: any) {
    yield put(readAllMessagesErrorAction(error));
    yield put(push(routes.login.path));
  }
}

export function* openMessageModal({ uuid }: OpenMessageModalAction): SagaIterator {
  const messages: MessagesResponse = yield select(makeSelectMessages());
  const message = messages.data.find((msg) => msg.uuid === uuid);
  const isReadedMessage = message ? message.readed : false;

  if (!isReadedMessage) {
    yield call(readMessage);
  }
}

export function* readMessage(): SagaIterator {
  const { accessToken }: { accessToken: string } = yield select(makeSelectToken());
  const openedMessage: string = yield select(makeSelectOpenedMessage());
  const requestURL: string = api.messages;
  const requestParameters: RequestOptions = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ uuid: openedMessage }),
  };

  try {
    yield put(readMessageAction());
    yield call(request, requestURL, requestParameters);
    yield put(readMessageSuccessAction());
  } catch (error: any) {
    yield put(readMessageErrorAction(error));
    yield put(push(routes.login.path));
  }
}

export function* getNotifications(): SagaIterator {
  const { accessToken }: { accessToken: string } = yield select(makeSelectToken());
  const user: any = yield select(makeSelectUser());
  const requestURL: string = `${api.notifications}?take=${user?.userConfig?.notificationCount}&order=DESC`;

  const requestParameters: RequestOptions = {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  try {
    const response: NotificationsResponse = yield call(request, requestURL, requestParameters);
    yield put(getNotificationsSuccessAction(response));
  } catch (error: any) {
    yield put(getNotificationsErrorAction(error));
    yield put(push(routes.login.path));
  }
}

export default function* loginPageSaga(): SagaIterator {
  yield takeLatest(LOGOUT_REQUEST, logout);
  yield takeLatest(GET_CURRENCIES_REQUEST, getCurrencies);
  yield takeLatest(CHECK_EMAIL_REQUEST, checkEmail);
  yield takeLatest(GET_MESSAGES_REQUEST, getMessages);
  yield takeLatest(READ_ALL_MESSAGES_REQUEST, readAllMessages);
  yield takeLatest(OPEN_MESSAGE_MODAL, openMessageModal);
  yield takeLatest(GET_NOTIFICATIONS_REQUEST, getNotifications);
}
