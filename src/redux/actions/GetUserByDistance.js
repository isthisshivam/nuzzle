import * as index from './index';

// init getUserByDistance
export function getUserByDistanceRequest(obj, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_DISTANCE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// getUserByDistance success
export function getUserByDistanceSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_DISTANCE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// getUserByDistance fail
export function getUserByDistanceFailure(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_DISTANCE_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
///////////
// init getUserByZipCode
export function getUserByZipCodeRequest(obj, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_ZIP_CODE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// getUserByZipCode success
export function getUserByZipCodeSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_ZIP_CODE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// getUserByZipCode fail
export function getUserByZipCodeFailure(userData, onSuccess, onFailure) {
  return {
    type: index.GET_USER_BY_ZIP_CODE_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
