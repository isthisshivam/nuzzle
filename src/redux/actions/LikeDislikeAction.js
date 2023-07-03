import * as index from './index';

// init likeDislike
export function likeDislikeRequest(obj, onSuccess, onFailure) {
  return {
    type: index.LIKE_DISLIKE_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// likeDislike success
export function likeDislikeSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.LIKE_DISLIKE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// likeDislike fail
export function likeDislikeFailure(userData, onSuccess, onFailure) {
  return {
    type: index.LIKE_DISLIKE_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
