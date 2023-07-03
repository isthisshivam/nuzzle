import * as index from './index';

export function getUserRequest(obj, onSuccess, onFailure) {
  return {
    type: index.GET_USER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}
export function getUserSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
export function getUserFailure(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
