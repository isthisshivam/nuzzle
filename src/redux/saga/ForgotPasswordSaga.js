import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as ForgotPasswordAction from '../actions/ForgotPasswordAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* forgotPasswordModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.FORGOT_PASSWORD,
      data.payload.obj,
    );
    yield put(ForgotPasswordAction.forgotPasswordSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(ForgotPasswordAction.forgotPasswordFailure());
    data.onFailure(error);
  }
}

export default function* forgotPasswordSaga() {
  yield takeLatest(ActionType.FORGOT_PASSWORD_REQUEST, forgotPasswordModule);
}
