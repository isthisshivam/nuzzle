import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const forgotPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default forgotPasswordReducer;
