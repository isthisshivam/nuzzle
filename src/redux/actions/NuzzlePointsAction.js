import * as index from './index';

// init nuzzlePoints
export function nuzzlePointsRequest(obj, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_POINTS_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzlePoints success
export function nuzzlePointsSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_POINTS_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// nuzzlePoints fail
export function nuzzlePointsFailure(userData, onSuccess, onFailure) {
  return {
    type: index.NUZZLE_POINTS_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
