import { AxiosError, AxiosResponse } from 'axios';
import {
	clearAccessToken,
	loadAccessToken,
	loadSessionAccessToken,
	saveAccessToken,
	saveRefreshToken,
	saveSessionAccessToken,
	saveSessionRefreshToken,
} from 'helpers/storage';
import { put, call, takeEvery, all, fork, StrictEffect, cancel } from 'redux-saga/effects';
import { BaseResponseDetail } from 'services/type';
import { getByAccessToken, login, LoginResponse } from 'services/user';
import { IUser } from 'services/user/type';

import * as actionCreators from '../actionCreators';
import * as actionTypes from '../actions';

export function* requestLogin({
	username,
	password,
	remember,
}: actionTypes.LoginAction): Generator<StrictEffect, void, AxiosResponse<LoginResponse>> {
	try {
		const response = yield call(login, { username, password });
		yield put(actionCreators.userLoginSuccess(response.data.operatorResponse));
		if (remember) {
			yield call(saveAccessToken, response.data.accessToken);
			yield call(saveRefreshToken, response.data.refreshToken);
		} else {
			yield call(saveSessionRefreshToken, response.data.refreshToken);
			yield call(saveSessionAccessToken, response.data.accessToken);
		}
	} catch (error) {
		const err = error as AxiosError<{ message: string }>;
		yield put(actionCreators.userLoginFail(err.response?.data?.message || err.message));
	}
}

function* watchOnRequesstLogin() {
	yield takeEvery(actionTypes.LOGIN_REQUEST, requestLogin);
}

export function* requestGetUserInfo(): Generator<StrictEffect, void, BaseResponseDetail<IUser>> {
	try {
		const ascessToken = loadAccessToken() || loadSessionAccessToken();
		if (!ascessToken) throw new Error("don't have ascessToken");
		const response = yield call(getByAccessToken);
		if (!response.data) {
			throw new Error('Get init failure');
		}
		yield put(actionCreators.initialUserSuccess(response.data));
	} catch (error) {
		const err = error as AxiosError<{ message: string }>;
		yield put(actionCreators.initialUserFalure(err.response?.data?.message || err.message));
	}
}

function* watchOnRequesstInital() {
	yield takeEvery(actionTypes.INITIAL, requestGetUserInfo);
}

export function* requestLogout() {
	try {
		const clearStore = () => {
			sessionStorage.clear();
			clearAccessToken();
		};
		yield call(clearStore);
		yield put(actionCreators.logoutSuccess());
	} catch (error) {
		yield cancel();
	}
}

function* watchOnRequestLogout() {
	yield takeEvery(actionTypes.LOGOUT_REQUEST, requestLogout);
}

export default function* userSaga() {
	yield all([fork(watchOnRequesstLogin), fork(watchOnRequesstInital), fork(watchOnRequestLogout)]);
}
