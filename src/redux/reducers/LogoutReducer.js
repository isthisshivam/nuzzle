import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userData: undefined,
};
//reducers
const logoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOG_OUT_LOADING:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.LOG_OUT_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
      };

    case ActionType.LOG_OUT_FAILURE:
      return {
        ...state,
        showLoader: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default logoutReducer;
