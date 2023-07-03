import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const getUserProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_USER_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.GET_USER_PROFILE_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default getUserProfileReducer;
