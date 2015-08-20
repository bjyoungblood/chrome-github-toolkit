import * as ActionTypes from '../constants/ActionTypes';

let initialState = {
  loading: false,
  pullRequest: null,
  owner: null,
  repo: null,
  issue: null,
  head: null,
  base: null,
  lastError: null,
};

const actionsMap = {
  [ActionTypes.CONVERT_PR]: (state, action) => {
    return {
      loading: false,
      pullRequest: null,
      lastError: null,
      ...action,
    };
  },
  [ActionTypes.CONVERT_PR_DONE]: (state, action) => {
    return Object.assign({}, state, {
      loading: false,
      pullRequest: action.pullRequest,
      lastError: null,
    });
  },
  [ActionTypes.CONVERT_PR_FAILED]: (state, action) => {
    return Object.assign({}, state, {
      loading: false,
      lastError: action.error,
    });
  },
  [ActionTypes.CONVERT_PR_CLEAR]: (state, action) => {
    return initialState;
  }
};

export default function prConvert(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
