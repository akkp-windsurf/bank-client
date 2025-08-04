/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import globalReducer from 'containers/App/reducer';
import languageProviderReducer from 'providers/LanguageProvider/reducer';
import loadingProviderReducer from 'providers/LoadingProvider/reducer';
import errorProviderReducer from 'providers/ErrorProvider/reducer';
import { RootState } from '../types/RootState';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers: Record<string, Reducer> = {}): Reducer<any> {
  const rootReducer = combineReducers({
    global: globalReducer,
    language: languageProviderReducer,
    loading: loadingProviderReducer,
    error: errorProviderReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}
