import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';

import * as LogoutAction from '../actions/LogoutAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* logoutModule(data) {
  try {
    const logoutData = yield call(
      sendRequest,
      apiCons.LOG_OUT,
      data.payload.obj,
    );
    yield put(LogoutAction.logoutSuccess(logoutData));
    data.onSuccess(logoutData);
  } catch (error) {
    yield put(LogoutAction.logoutFailure());
    data.onFailure(error);
  }
}

export default function* logoutSaga() {
  yield takeLatest(ActionType.LOG_OUT_LOADING, logoutModule);
}
