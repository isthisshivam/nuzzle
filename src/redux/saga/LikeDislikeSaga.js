import * as ActionType from '../actions';
import {takeLatest, call, put} from 'redux-saga/effects';
import * as LikeDislikeAction from '../actions/LikeDislikeAction';
import * as apiCons from '../../frequent/Utility/ApiConstants';
import {sendRequest} from '../webSerivces/webServiceCall';

function* likeDislikeModule(data) {
  try {
    const likeDislikeData = yield call(
      sendRequest,
      apiCons.LIKE_DISLIKE,
      data.payload.obj,
    );
    yield put(LikeDislikeAction.likeDislikeSuccess(likeDislikeData));
    console.log('LikeDislikeAction success', JSON.stringify(likeDislikeData));

    data.onSuccess(likeDislikeData);
  } catch (error) {
    yield put(LikeDislikeAction.likeDislikeFailure());
    data.onFailure(error);
  }
}

export default function* likedislikeSaga() {
  yield takeLatest(ActionType.LIKE_DISLIKE_REQUEST, likeDislikeModule);
}
