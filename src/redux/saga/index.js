import loginSaga from './loginSaga';
import {all} from 'redux-saga/effects';
import registerSaga from './RegisterSaga';
import verificationSaga from './verificationSaga';
import updateUserSaga from './updateUserSaga';
import homeSaga from './HomeSaga';
import userInfoSaga from './GetUserProfileSaga';
import likedislikeSaga from './LikeDislikeSaga';
import filterSaga from './FilterSaga';
import {
  getUserByDistanceSaga,
  getUserByZipCodeSaga,
} from './GetUserByDistanceSaga';
import setGetUserSettingModule from './SetGetUserSettingSaga';
import nuzzleUpSaga from './NuzzleUpSaga';
import logoutSaga from './LogoutSaga';
import nuzzleUpDeleteSaga from './NuzzleUpDeleteSaga';
import forgotPasswordSaga from './ForgotPasswordSaga';
import nuzzlePointsSaga from './NuzzlePointsSaga';
import likedUersSaga from './LikedUserSaga';
export default function* rootSaga() {
  yield all([
    loginSaga(),
    registerSaga(),
    verificationSaga(),
    updateUserSaga(),
    homeSaga(),
    userInfoSaga(),
    likedislikeSaga(),
    filterSaga(),
    getUserByDistanceSaga(),
    nuzzleUpSaga(),
    setGetUserSettingModule(),
    nuzzleUpDeleteSaga(),
    logoutSaga(),
    forgotPasswordSaga(),
    nuzzlePointsSaga(),
    getUserByZipCodeSaga(),
    likedUersSaga(),
  ]);
}
