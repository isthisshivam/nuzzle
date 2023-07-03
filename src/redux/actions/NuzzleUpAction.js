import * as index from './index';

// init nuzzleUp
export function nuzzleUpRequest(obj, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzleUp success
export function nuzzleUpSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzleUp fail
export function nuzzleUpFailure(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_UP_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
