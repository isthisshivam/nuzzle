import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const setGetUserSettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_AND_SET_USER_SETTING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.GET_AND_SET_USER_SETTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.GET_AND_SET_USER_SETTING_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default setGetUserSettingReducer;
