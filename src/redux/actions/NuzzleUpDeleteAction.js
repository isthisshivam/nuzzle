import * as index from './index';

// init nuzzleUp  delete
export function nuzzleUpDeleteRequest(obj, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_DELETE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzleUp  delete  success
export function nuzzleUpDeleteSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_DELETE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzleUp  delete fail
export function nuzzleUpDeleteFailure(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_DELETE_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
