import * as ActionTypes from '../constants/ActionTypes';

let initialState = {
  list: [],
  loading: false,
};

const actionsMap = {
  [ActionTypes.REQUEST_BRANCHES]: (state, action) => {
    return Object.assign({}, state, {
      loading: true,
    });
  },
  [ActionTypes.RECEIVE_BRANCHES]: (state, action) => {
    return Object.assign({}, state, {
      list: action.branches,
      loading: false,
    });
  },
};

export default function branches(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
