import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userData: undefined,
};
//reducers
const nuzzlePointsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.NUZZLE_POINTS_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.NUZZLE_POINTS_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.NUZZLE_POINTS_ERROR:
      return {
        ...state,
        isLogin: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default nuzzlePointsReducer;
