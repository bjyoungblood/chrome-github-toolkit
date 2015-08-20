import { combineReducers } from 'redux';
import token from './token';
import branches from './branches';
import pullRequests from './pull-requests';
import convert from './pr-convert';

const rootReducer = combineReducers({
  token,
  branches,
  pullRequests,
  convert,
});

export default rootReducer;
