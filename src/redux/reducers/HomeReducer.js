import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userDataList: undefined,
};
//reducers
const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_USER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.GET_USER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userDataList: action.payload.userData.data,
      };

    case ActionType.GET_USER_ERROR:
      return {
        ...state,
        showLoader: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default homeReducer;
