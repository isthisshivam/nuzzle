import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as GetUserByDistanceAction from '../actions/GetUserByDistance';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* locationBasedUserModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.GET_LOCATION_BASED_USER,
      data.payload.obj,
    );
    yield put(GetUserByDistanceAction.getUserByDistanceSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(GetUserByDistanceAction.getUserByDistanceFailure());
    data.onFailure(error);
  }
}

function* getUserByDistanceSaga() {
  yield takeLatest(
    ActionType.GET_USER_BY_DISTANCE_REQUEST,
    locationBasedUserModule,
  );
}
///////
function* zipCodeBasedUserModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      'http://rapidsofts.com/nuzzle/backend/web/api/filter-zipcode',
      data.payload.obj,
    );
    yield put(GetUserByDistanceAction.getUserByZipCodeSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(GetUserByDistanceAction.getUserByZipCodeFailure());
    data.onFailure(error);
  }
}

function* getUserByZipCodeSaga() {
  yield takeLatest(
    ActionType.GET_USER_BY_ZIP_CODE_REQUEST,
    zipCodeBasedUserModule,
  );
}

export {getUserByZipCodeSaga, getUserByDistanceSaga};
