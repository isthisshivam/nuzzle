import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import {nuzzlePointsFailure} from '../actions/NuzzlePointsAction';
import Constants from '../../frequent/Constants';
import * as nuzzlePointsAction from '../actions/NuzzlePointsAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* nuzzlePointsModule(data) {
  try {
    const nuzzlePointsData = yield call(
      sendRequest,
      apiCons.NUZZLE_POINTS,
      data.payload.obj,
    );
    yield put(nuzzlePointsAction.nuzzlePointsSuccess(nuzzlePointsData));
    data.onSuccess(nuzzlePointsData);
  } catch (error) {
    yield put(nuzzlePointsFailure());
    data.onFailure(error);
  }
}

export default function* nuzzlePointsSaga() {
  yield takeLatest(ActionType.NUZZLE_POINTS_REQUEST, nuzzlePointsModule);
}
