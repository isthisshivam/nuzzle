import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import Constants from '../../frequent/Constants';
import * as SetGetUserSettingAction from '../actions/SetGetUserSettingAction';
import * as ApiConstants from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* setGetUserSettingModule(data) {
  try {
    const userData = yield call(
      sendRequest,
      ApiConstants.USER_SETTING,
      data.payload.obj,
    );
    yield put(SetGetUserSettingAction.setGetUserSettingSuccess(userData));
    data.onSuccess(userData);
  } catch (error) {
    yield put(SetGetUserSettingAction.setGetUserSettingFailure());
    data.onFailure(error);
  }
}

export default function* setGetUserSettingSaga() {
  yield takeLatest(
    ActionType.GET_AND_SET_USER_SETTING_REQUEST,
    setGetUserSettingModule,
  );
}
