import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as LikedUsers from '../actions/LikedUsers';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* likedUserModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.LIKE_USERS,
      data.payload.obj,
    );
    yield put(LikedUsers.likedUserSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(LikedUsers.likedUserFailure());
    data.onFailure(error);
  }
}

export default function* likedUersSaga() {
  yield takeLatest(ActionType.LIKED_USER_REQUEST, likedUserModule);
}
