import * as ActionType from '../actions';

const initialState = {
  isRegister: false,
  showLoader: false,
  userData: undefined,
};

//reducers
const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.REGISTER_USER:
      return {
        ...state,
        showLoader: true,
      };

    case ActionType.REGISTER_SUCCESS:
      return {
        ...state,
        showLoader: false,
        userData: action.payload.userData.data,
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

export default registerReducer;
