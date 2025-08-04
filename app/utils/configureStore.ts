/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose, Store, StoreEnhancer } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { History } from 'history';
import createReducer from './reducers';
import { RootState } from '../types/RootState';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __SAGA_MONITOR_EXTENSION__?: any;
  }
}

interface ConfigureStoreOptions {
  initialState?: Partial<RootState>;
  history: History;
}

export default function configureStore(
  initialState: any = {},
  history: History,
): Store<any> {
  let composeEnhancers = compose;
  const reduxSagaMonitorOptions: any = {};

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
    }

    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    // if (window.__SAGA_MONITOR_EXTENSION__)
    //   reduxSagaMonitorOptions = {
    //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
    //   };
    /* eslint-enable */
  }

  const sagaMiddleware: SagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware(history)];

  const enhancers: StoreEnhancer[] = [
    applyMiddleware(...middlewares),
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store: Store<any> = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if ((module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }

  return store;
}
