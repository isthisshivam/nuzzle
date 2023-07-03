import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const nuzzleUpDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.NUZZLE_UP_DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.NUZZLE_UP_DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.NUZZLE_UP_DELETE_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default nuzzleUpDeleteReducer;
