import * as index from './index';

// init likedUser
export function likedUserRequest(obj, onSuccess, onFailure) {
  return {
    type: index.LIKED_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// likedUser success
export function likedUserSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.LIKED_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// likedUser fail
export function likedUserFailure(userData, onSuccess, onFailure) {
  return {
    type: index.LIKED_USER_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
