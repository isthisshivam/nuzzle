import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import * as register from '../actions/RegisterAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* registerModule(data) {
  try {
    const registerData = yield call(
      sendRequest,
      apiCons.SIGNUP,
      data.payload.obj,
    );
    yield put(register.registerSuccess(registerData));
    console.log('register success', JSON.stringify(registerData));

    data.onSuccess(registerData);
  } catch (error) {
    yield put(register.registerFailure());
    data.onFailure(error);
  }
}

export default function* registerSaga() {
  yield takeLatest(ActionType.REGISTER_USER, registerModule);
}
