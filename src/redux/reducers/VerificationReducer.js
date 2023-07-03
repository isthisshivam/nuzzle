import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userData: undefined,
};

//reducers
const verificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.VERIFICATION:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.RESEND_CODE:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.RESEND_CODE_SUCCESS:
      return {
        ...state,
        showLoader: false,
      };

    case ActionType.VERIFICATION_SUCCESS:
      return {
        ...state,
        userData: action.payload.userData.data,
        showLoader: false,
      };

    case ActionType.ON_ERROR:
      return {
        ...state,
        showLoader: false,
      };

    default:
      return state;
  }
};

export default verificationReducer;
