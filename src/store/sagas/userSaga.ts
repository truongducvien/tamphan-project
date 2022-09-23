import { AxiosError, AxiosResponse } from 'axios';
import { put, call, takeEvery, all, fork, StrictEffect, cancel } from 'redux-saga/effects';
import { alert } from 'src/components/alertDialog/hook';
import { clearAccessToken, loadAccessToken, saveAccessToken, saveRefreshToken } from 'src/helpers/storage';
import { BaseResponseDetail } from 'src/services/type';
import { getByAccessToken, login, LoginResponse, userChangeAvatar } from 'src/services/user';
import { IUser } from 'src/services/user/type';

import * as actionCreators from '../actionCreators';
import * as actionTypes from '../actions';

export function* requestLogin({
	username,
	password,
}: actionTypes.LoginAction): Generator<StrictEffect, void, AxiosResponse<LoginResponse>> {
	try {
		const response = yield call(login, { username, password });
		if (response.data.operatorResponse?.isFirstTimeLogin) {
			yield call(alert, {
				title: 'Cảnh báo',
				description: 'Bạn cần đổi mật khẩu trong lần đầu đăng nhập',
				type: 'message',
			});
		}
		yield put(actionCreators.userLoginSuccess(response.data.operatorResponse));
		yield call(saveAccessToken, response.data.accessToken);
		yield call(saveRefreshToken, response.data.refreshToken);
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
		const ascessToken = loadAccessToken();
		if (!ascessToken) throw new Error("don't have ascessToken");
		const response = yield call(getByAccessToken);
		if (!response.data) {
			throw new Error('Get init failure');
		}
		if (response.data.isFirstTimeLogin) {
			yield call(alert, {
				title: 'Cảnh báo',
				description: 'Bạn cần đổi mật khẩu trong lần đầu đăng nhập',
				type: 'message',
			});
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

function* requestLogout() {
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

function* requestChangeAvatar({
	link,
}: actionTypes.ChangeAvatarAction): Generator<StrictEffect, void, BaseResponseDetail<IUser>> {
	try {
		const response = yield call(userChangeAvatar, link);
		if (!response?.data) {
			throw Error('No data User response');
		}
		yield put(actionCreators.userLoginSuccess(response?.data));
		yield call(alert, {
			title: 'Cập nhật hình đại diện thành công.',
			type: 'message',
		});
	} catch (error) {
		const err = error as AxiosError<{ message: string }>;
		yield put(actionCreators.changeAvatarFalure(err));
		yield call(alert, {
			title: 'Cập nhật hình đại diện thất bại.',
			type: 'message',
		});
	}
}

function* watchOnRequestLogout() {
	yield takeEvery(actionTypes.LOGOUT_REQUEST, requestLogout);
}

function* watchOnRequestChangeAvatar() {
	yield takeEvery(actionTypes.CHANGE_AVARTAR, requestChangeAvatar);
}

export default function* userSaga() {
	yield all([
		fork(watchOnRequesstLogin),
		fork(watchOnRequesstInital),
		fork(watchOnRequestLogout),
		fork(watchOnRequestChangeAvatar),
	]);
}
