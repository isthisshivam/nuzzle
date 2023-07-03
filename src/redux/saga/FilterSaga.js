import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as FilterAction from '../actions/FilterAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* filterModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.FILTERATION,
      data.payload.obj,
    );
    yield put(FilterAction.filterSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(FilterAction.filterFailure());
    data.onFailure(error);
  }
}

export default function* filterSaga() {
  yield takeLatest(ActionType.FILTER_REQUEST, filterModule);
}
