import * as index from './index';

// init filter
export function filterRequest(obj, onSuccess, onFailure) {
  return {
    type: index.FILTER_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// filter success
export function filterSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.FILTER_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// filter fail
export function filterFailure(userData, onSuccess, onFailure) {
  return {
    type: index.FILTER_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
