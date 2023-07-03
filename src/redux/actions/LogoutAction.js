import * as index from './index';

// init logout
export function logoutRequest(obj, onSuccess, onFailure) {
  return {
    type: index.LOG_OUT_LOADING,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// logout success
export function logoutSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.LOG_OUT_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// logout fail
export function logoutFailure(userData, onSuccess, onFailure) {
  return {
    type: index.LOG_OUT_FAILURE,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
