import { AxiosResponse } from 'axios';
import { put, call, takeEvery, all, fork, StrictEffect } from 'redux-saga/effects';
import { login, LoginResponse } from 'services/user';

import * as actionCreators from '../actionCreators';
import * as actionTypes from '../actions';

export function* requestLogin({
	username,
	password,
}: actionTypes.LoginAction): Generator<StrictEffect, void, AxiosResponse<LoginResponse>> {
	try {
		const response = yield call(login, username, password);
		yield put(actionCreators.userLoginSuccess(response.data.user));
	} catch (err) {
		yield put(actionCreators.userLoginFail('login fail'));
	} finally {
		yield put(actionCreators.userLoginFail('login fail'));
	}
}

function* watchOnRequesstLogin() {
	yield takeEvery(actionTypes.LOGIN_REQUEST, requestLogin);
}

export default function* userSaga() {
	yield all([fork(watchOnRequesstLogin)]);
}
