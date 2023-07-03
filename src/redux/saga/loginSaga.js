import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import {loginFailure} from '../actions/LoginAction';
import Constants from '../../frequent/Constants';
import * as login from '../actions/LoginAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* loginModule(data) {
  try {
    const loginData = yield call(sendRequest, apiCons.LOGIN, data.payload.obj);
    yield put(login.loginSuccess(loginData));
    data.onSuccess(loginData);
  } catch (error) {
    yield put(loginFailure());
    data.onFailure(error);
  }
}

export default function* loginSaga() {
  yield takeLatest(ActionType.DO_LOGIN, loginModule);
}
