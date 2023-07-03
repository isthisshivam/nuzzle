import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const getUserByDistanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_USER_BY_DISTANCE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.GET_USER_BY_DISTANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.GET_USER_BY_DISTANCE_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    //////////
    case ActionType.GET_USER_BY_ZIP_CODE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.GET_USER_BY_ZIP_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.GET_USER_BY_ZIP_CODE_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default getUserByDistanceReducer;
