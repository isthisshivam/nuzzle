import {combineReducers} from 'redux';
import loginReducer from './LoginReducer';
import registerReducer from './RegisterReducer';
import verificationReducer from './VerificationReducer';
import homeReducer from './HomeReducer';
import updateUserReducer from './updateUserReducer';
import getUserProfileReducer from './GetUserProfileReducer';
import likeDislikeReducer from './LikeDislikeReducer';
import filterReducer from './FilterReducer';
import getUserByDistanceReducer from './GetUserByDistanceReducer';
import nuzzleUpReducer from './NuzzleUpReducer';
import setGetUserSettingReducer from './SetGetUserSettingReducer';
import nuzzleUpDeleteReducer from './NuzzleUpDeleteReducer';
import logoutReducer from './LogoutReducer';
import forgotPasswordReducer from './ForgotPasswordreducer';
import nuzzlePointsReducer from './NuzzlePointsReducer';
import likedUsersReducer from './LikedUsersReducer';
import * as ActionType from '../actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// root reducer
const appReducer = combineReducers({
  loginReducer: loginReducer,
  registerReducer: registerReducer,
  verificationReducer: verificationReducer,
  homeReducer: homeReducer,
  updateUserReducer: updateUserReducer,
  getUserProfileReducer: getUserProfileReducer,
  likeDislikeReducer: likeDislikeReducer,
  filterReducer: filterReducer,
  getUserByDistanceReducer: getUserByDistanceReducer,
  nuzzleUpReducer: nuzzleUpReducer,
  setGetUserSettingReducer: setGetUserSettingReducer,
  nuzzleUpDeleteReducer: nuzzleUpDeleteReducer,
  logoutReducer: logoutReducer,
  forgotPasswordReducer: forgotPasswordReducer,
  nuzzlePointsReducer: nuzzlePointsReducer,
  likedUsersReducer: likedUsersReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === ActionType.LOG_OUT) {
    AsyncStorage.removeItem('persist:root');

    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
