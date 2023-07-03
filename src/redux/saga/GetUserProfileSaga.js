import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as GetUserProfileAction from '../actions/GetUserProfileAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* getProfileModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.USER_INFO,
      data.payload.obj,
    );
    yield put(GetUserProfileAction.getProfileSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(GetUserProfileAction.getProfileFailure());
    data.onFailure(error);
  }
}

export default function* userInfoSaga() {
  yield takeLatest(ActionType.GET_USER_PROFILE_REQUEST, getProfileModule);
}
