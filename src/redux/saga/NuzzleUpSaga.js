import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as NuzzleUpAction from '../actions/NuzzleUpAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* nuzzleUpModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.NUZZLE_UP,
      data.payload.obj,
    );
    yield put(NuzzleUpAction.nuzzleUpSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(NuzzleUpAction.nuzzleUpFailure());
    data.onFailure(error);
  }
}

export default function* nuzzleUpSaga() {
  yield takeLatest(ActionType.NUZZLE_UP_REQUEST, nuzzleUpModule);
}
