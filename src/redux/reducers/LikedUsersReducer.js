import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const likedUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LIKED_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.LIKED_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.LIKED_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default likedUsersReducer;
