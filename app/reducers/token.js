import * as ActionTypes from '../constants/ActionTypes';

let initialState = {
  token: '',
  loading: false,
  lastError: null,
};

const actionsMap = {
  [ActionTypes.REQUEST_TOKEN]: (state, action) => {
    return Object.assign({}, state, {
      token: null,
      loading: true,
      lastError: null,
    });
  },
  [ActionTypes.RECEIVE_TOKEN]: (state, action) => {
    return Object.assign({}, state, {
      token: action.token,
      loading: false,
      lastError: null,
    });
  },
  [ActionTypes.LOGOUT]: (state, action) => {
    return Object.assign({}, state, {
      token: null,
      loading: false,
      lastError: null,
    });
  },
};

export default function token(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
