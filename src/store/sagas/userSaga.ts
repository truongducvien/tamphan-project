import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeEvery, all, fork, StrictEffect, cancel } from 'redux-saga/effects';
import { alert } from 'src/components/alertDialog/hook';
import {
	clearAccessToken,
	loadAccessToken,
	loadSessionAccessToken,
	saveAccessToken,
	saveRefreshToken,
	saveSessionAccessToken,
	saveSessionRefreshToken,
} from 'src/helpers/storage';
import { BaseResponseDetail } from 'src/services/type';
import { getByAccessToken, login, LoginResponse } from 'src/services/user';
import { IUser } from 'src/services/user/type';

import * as actionCreators from '../actionCreators';
import * as actionTypes from '../actions';

export function* requestLogin({
	username,
	password,
	remember,
}: actionTypes.LoginAction): Generator<StrictEffect, void, AxiosResponse<LoginResponse>> {
	try {
		const response = yield call(login, { username, password });
		if (response.data.operatorResponse?.isFirstTimeLogin) {
			yield call(alert, {
				title: 'Cảnh báo',
				description: 'Bạn cần đổi mật khẩu trong lần đầu đăng nhập',
				type: 'error',
			});
		}
		yield put(actionCreators.userLoginSuccess(response.data.operatorResponse));
		if (remember) {
			yield call(saveAccessToken, response.data.accessToken);
			yield call(saveRefreshToken, response.data.refreshToken);
		} else {
			yield call(saveSessionRefreshToken, response.data.refreshToken);
			yield call(saveSessionAccessToken, response.data.accessToken);
		}
	} catch (error) {
		const err = error as AxiosError<{ message: string; code: string }>;
		const meg =
			err?.response?.data?.code === 'INVALID_USERNAME_OR_PASSWORD'
				? 'Sai tên đăng nhập hoặc mật khẩu'
				: 'Lỗi không xác định, vui lòng thử lại';
		yield put(actionCreators.userLoginFail(meg));
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
