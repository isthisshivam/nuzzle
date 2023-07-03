import * as ActionType from '../actions';

const initialState = {
  showLoader: false,
  userDataList: undefined,
};
//reducers
const updateUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.UPDATE_USER_REQUEST:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.UPDATE_USER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userDataList: action.payload.userData.data,
      };

    case ActionType.UPDATE_USER_ERROR:
      return {
        ...state,
        showLoader: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default updateUserReducer;
