import * as ActionType from '../actions';

const initialState = {
  isRegister: false,
  showLoaderLikeDislike: false,
  userData: undefined,
};

//reducers
const likeDislikeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LIKE_DISLIKE_REQUEST:
      return {
        ...state,
        showLoaderLikeDislike: true,
      };

    case ActionType.LIKE_DISLIKE_SUCCESS:
      return {
        ...state,
        showLoaderLikeDislike: false,
        userData: action.payload.userData,
      };

    case ActionType.LIKE_DISLIKE_ERROR:
      return {
        ...state,
        showLoaderLikeDislike: false,
      };

    default:
      return state;
  }
};

export default likeDislikeReducer;
