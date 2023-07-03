import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as home from '../actions/HomeAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* userModule(data) {
  try {
    const userData = yield call(sendRequest, apiCons.HOME, data.payload.obj);
    yield put(home.getUserSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(home.getUserFailure(error));
    data.onFailure(error);
  }
}

export default function* homeSaga() {
  yield takeLatest(ActionType.GET_USER_REQUEST, userModule);
}
