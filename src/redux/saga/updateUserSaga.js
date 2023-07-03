import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as UpdateUserAction from '../actions/UpdateUserAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* userUpdateModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.UPDATE_USER,
      data.payload.obj,
    );
    yield put(UpdateUserAction.updateUserSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(UpdateUserAction.updateUserFailure());
    data.onFailure(error);
  }
}

export default function* updateUserSaga() {
  yield takeLatest(ActionType.UPDATE_USER_REQUEST, userUpdateModule);
}
