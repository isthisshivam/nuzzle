import * as index from './index';

// init updateUser
export function updateUserRequest(obj, onSuccess, onFailure) {
  return {
    type: index.UPDATE_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// updateUser success
export function updateUserSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.UPDATE_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// updateUser fail
export function updateUserFailure(userData, onSuccess, onFailure) {
  return {
    type: index.UPDATE_USER_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
