import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import storage from './storage';

const middlewares = applyMiddleware(thunk);
let finalCreateStore;
if (__DEVELOPMENT__) {
  finalCreateStore = compose(
    middlewares,
    storage(),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
} else {
  finalCreateStore = compose(
    middlewares,
    storage(),
    createStore
  );
}

const store = finalCreateStore(rootReducer, window.state);
delete window.state;

export default store;
