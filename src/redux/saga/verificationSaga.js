import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import * as verification from '../actions/VerificationAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* verificationModule(data) {
  try {
    const dataVerify = yield call(
      sendRequest,
      apiCons.VERIFY_CODE,
      data.payload.obj,
    );
    yield put(verification.verificationSuccess(dataVerify));

    data.onSuccess(dataVerify);
  } catch (error) {
    yield put(verification.verificationFailure());
    data.onFailure(error);
  }
}

function* resendCode(data) {
  try {
    const resendData = yield call(
      sendRequest,
      apiCons.RESEND_CODE,
      data.payload.obj,
    );
    yield put(verification.resendCodeSuccess(resendData));

    data.onSuccess(resendData);
  } catch (error) {
    yield put(verification.verificationFailure());
    data.onFailure(error);
  }
}

export default function* verificationSaga() {
  yield takeLatest(ActionType.VERIFICATION, verificationModule);
  yield takeLatest(ActionType.RESEND_CODE, resendCode);
}
