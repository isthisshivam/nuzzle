import * as index from './index';

// init setGetUserSetting
export function setGetUserSettingRequest(obj, onSuccess, onFailure) {
  return {
    type: index.GET_AND_SET_USER_SETTING_REQUEST,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// setGetUserSetting success
export function setGetUserSettingSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.GET_AND_SET_USER_SETTING_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// setGetUserSetting fail
export function setGetUserSettingFailure(userData, onSuccess, onFailure) {
  return {
    type: index.GET_AND_SET_USER_SETTING_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
