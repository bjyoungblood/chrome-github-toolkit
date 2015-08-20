import * as ActionTypes from '../constants/ActionTypes';

let initialState = {
  list: [],
  count: 0,
  loading: false,
};

const actionsMap = {
  [ActionTypes.REQUEST_PULL_REQUESTS]: (state, action) => {
    return Object.assign({}, state, {
      loading: true,
    });
  },
  [ActionTypes.RECEIVE_PULL_REQUESTS]: (state, action) => {
    return Object.assign({}, state, {
      list: action.pullRequests,
      count: action.pullRequests.length,
      loading: false,
    });
  },
};

export default function pullRequests(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
