import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userData: undefined,
};
//reducers
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.DO_LOGIN:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.ON_ERROR:
      return {
        ...state,
        showLoader: false,
        apiError: action.payload.apiError,
      };

    //     case ActionType.LOG_OUT:

    //       alert('logout')
    //         return {
    //             ...state,
    //            isLogin : false,
    //            userData : undefined

    // }

    case ActionType.ACCESS_LOGIN:
      return {
        ...state,
        isLogin: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default loginReducer;
