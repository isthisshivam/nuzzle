import * as ActionType from '../actions';

const initialState = {
  isLoading: false,
  userInformation: undefined,
};
//reducers
const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.FILTER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case ActionType.FILTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: action.payload.userData.data,
      };

    case ActionType.FILTER_ERROR:
      return {
        ...state,
        isLoading: false,
        apiError: action.payload.apiError,
      };

    default:
      return state;
  }
};

export default filterReducer;
