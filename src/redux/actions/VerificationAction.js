import * as index from './index';

// init verification
export function startVerification(obj, onSuccess, onFailure) {
  return {
    type: index.VERIFICATION,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// init verification
export function resendCode(obj, onSuccess, onFailure) {
  return {
    type: index.RESEND_CODE,
    payload: {
      obj,
    },
    onSuccess,
    onFailure,
  };
}

// verification success
export function verificationSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.VERIFICATION_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// resend code success
export function resendCodeSuccess(userData, onSuccess, onFailure) {
  return {
    type: index.RESEND_CODE_SUCCESS,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}

// login fail
export function verificationFailure(userData, onSuccess, onFailure) {
  return {
    type: index.ON_ERROR,
    payload: {
      userData,
    },
    onSuccess,
    onFailure,
  };
}
