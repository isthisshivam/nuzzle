import * as index from './index';

// init userInfo
export function getProfileRequest(obj, onSuccess, onFailure) {
  return {
    type: index.GET_USER_PROFILE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// userInfo success
export function getProfileSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_PROFILE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// userInfo fail
export function getProfileFailure(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_PROFILE_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
