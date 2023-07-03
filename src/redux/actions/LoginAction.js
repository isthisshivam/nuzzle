import * as index from './index';

// init Login
export function doLogin(obj, onSuccess, onFailure) {
  return {
    type: index.DO_LOGIN,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// login success
export function loginSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.LOGIN_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// login fail
export function loginFailure(userData, onSuccess, onFailure) {
  return {
    type: index.ON_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// logout action
export function logout() {
  return {
    type: index.LOG_OUT,
    payload: {},
  };
}
