import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as NuzzleUpDeleteAction from '../actions/NuzzleUpDeleteAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* nuzzleUpDeleteModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.NUZZLE_UP_DELETE,
      data.payload.obj,
    );
    yield put(NuzzleUpDeleteAction.nuzzleUpDeleteSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(NuzzleUpDeleteAction.nuzzleUpDeleteFailure());
    data.onFailure(error);
  }
}

export default function* nuzzleUpDeleteSaga() {
  yield takeLatest(ActionType.NUZZLE_UP_DELETE_REQUEST, nuzzleUpDeleteModule);
}
