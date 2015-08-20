import Octokat from 'octokat';
import request from 'superagent';
import * as types from '../constants/ActionTypes';

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const APP_ID = '';
const REDIRECT_URI = `https://${APP_ID}.chromiumapp.org/github_cb`;
const SCOPES = 'repo';
const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;

export function requestToken() {
  return function(dispatch) {
    dispatch({ type: types.REQUEST_TOKEN });

    chrome.identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true,
    }, function(redirectUrl) {
      if (chrome.runtime.lastError) {
        return dispatch({ type: types.LOGIN_ERROR, error: chrome.runtime.lastError.message });
      }

      if (redirectUrl.indexOf('code=') === -1) {
        return dispatch({ type: types.LOGIN_ERROR, error: 'Invalid response' });
      }

      let authCode = redirectUrl.substring(redirectUrl.indexOf('code=') + 5);

      request.post('https://github.com/login/oauth/access_token')
        .type('json')
        .send({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: authCode,
          redirect_uri: REDIRECT_URI,
        })
        .set('Accept', 'application/json')
        .unset('Cookie')
        .end(function(err, res) {
          if (err) {
            return dispatch({ type: types.LOGIN_ERROR, error: err.message });
          }

          return dispatch({ type: types.RECEIVE_TOKEN, token: res.body.access_token });
        });
    });
  };
}

export function receiveToken(token) {
  return {
    type: types.RECEIVE_TOKEN,
    token,
  };
}

export function logout() {
  return { type: types.LOGOUT };
}

export function requestBranches(token, owner, repo) {
  return {
    type: types.REQUEST_BRANCHES,
    token,
    owner,
    repo,
  };
}

export function receiveBranches(branches) {
  return {
    type: types.RECEIVE_BRANCHES,
    branches,
  };
}

export function fetchBranches(token, owner, repo) {
  return function(dispatch) {
    dispatch(requestBranches(token, owner, repo));

    let octokat = new Octokat({ token: token });
    return octokat.repos(owner, repo).branches.fetch()
      .then((branches) => {
        dispatch(receiveBranches(branches));
      });
  };
}

export function requestPullRequests(token, owner, repo) {
  return {
    type: types.REQUEST_PULL_REQUESTS,
    token,
    owner,
    repo,
  };
}

export function receivePullRequests(pullRequests) {
  return {
    type: types.RECEIVE_PULL_REQUESTS,
    pullRequests,
  };
}

export function fetchPullRequests(token, owner, repo) {
  return function(dispatch) {
    dispatch(requestPullRequests(token, owner, repo));

    let octokat = new Octokat({ token: token });
    return octokat.repos(owner, repo).pulls.fetch({
      state: 'open',
      per_page: 100,
    })
      .then((pullRequests) => {
        dispatch(receivePullRequests(pullRequests));
      });
  };
}

export function convert(token, owner, repo, issue, base, head) {
  return {
    type: types.CONVERT_PR,
    token, owner, repo, issue, base, head,
  };
}

export function convertDone(pullRequest) {
  return {
    type: types.CONVERT_PR_DONE,
    pullRequest,
  };
}

export function convertFailed(err) {
  return {
    type: types.CONVERT_PR_FAILED,
    error: err,
  };
}

export function convertPrClear() {
  return {
    type: types.CONVERT_PR_CLEAR,
  };
}

export function convertIssue(token, owner, repo, issue, base, head) {
  return function(dispatch) {
    dispatch(convert(token, owner, repo, issue, base, head));

    let octokat = new Octokat({ token: token });
    return octokat.repos(owner, repo).pulls.create({
      issue, base, head,
    })
      .then((pullRequest) => {
        dispatch(convertDone(pullRequest));

        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          if (! tabs[0]) {
            return;
          }

          chrome.tabs.reload(tabs[0].id);
        });
      })
      .error((err) => {
        try {
          let errinfo = JSON.parse(err.message);
          if (errinfo.message === 'Validation Failed') {
            if (errinfo.errors.length === 3) {
              dispatch(convertFailed(errinfo.errors[2].message));
            } else if (errinfo.errors[0].message) {
              dispatch(convertFailed(errinfo.errors[0].message));
            } else {
              dispatch(convertFailed(err.message));
            }
          } else {
            dispatch(convertFailed(errinfo.message));
          }
        } catch (e) {
          dispatch(convertFailed(e));
        }
      });
  };
}
