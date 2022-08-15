import { AxiosError, AxiosResponse } from 'axios';
import {
	clearAccessToken,
	loadRole,
	loadSessionRole,
	saveAccessToken,
	saveRole,
	saveSessionAccessToken,
	saveSessionRole,
} from 'helpers/storage';
import { put, call, takeEvery, all, fork, StrictEffect, cancel } from 'redux-saga/effects';
import { getRoleById } from 'services/role';
import { IRoleDetail } from 'services/role/type';
import { login, LoginResponse } from 'services/user';

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
			yield call(saveRole, response.data.operatorResponse.roleId);
		} else {
			yield call(saveSessionRole, response.data.operatorResponse.roleId);
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

export function* requestGetUserInfo(): Generator<StrictEffect, void, IRoleDetail> {
	try {
		const roleId = loadRole() || loadSessionRole();
		if (!roleId) {
			throw new Error("don't have roleId");
		}
		const response = yield call(getRoleById, roleId);
		if (!response.data?.privileges) {
			throw new Error('Get role failure');
		}
		yield put(actionCreators.initialUserSuccess(response.data?.privileges));
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
