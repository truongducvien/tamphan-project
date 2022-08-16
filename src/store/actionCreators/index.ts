import { IUser } from 'services/user/type';

import * as actions from '../actions';

export function userLogin(username: string, password: string, remember?: boolean): actions.LoginAction {
	return {
		type: actions.LOGIN_REQUEST,
		username,
		password,
		remember,
	};
}

export function userLoginSuccess(user: IUser): actions.LoginSuccessAction {
	return {
		type: actions.LOGIN_SUCCESS,
		user,
	};
}

export function userLoginFail(error: Error | string): actions.LoginFailureAction {
	return {
		type: actions.LOGIN_FAILURE,
		error,
	};
}

export function initialUser(): actions.InitialAction {
	return {
		type: actions.INITIAL,
	};
}

export function initialUserSuccess(user: IUser): actions.InitialSuscessAction {
	return {
		type: actions.INITIAL_SUCESS,
		user,
	};
}

export function logout(): actions.LogoutAction {
	return {
		type: actions.LOGOUT_REQUEST,
	};
}

export function logoutSuccess(): actions.LogoutSuccessAction {
	return {
		type: actions.LOGOUT_SUCCESS,
	};
}

export function initialUserFalure(error: Error | string): actions.InitiaFailurelAction {
	return {
		type: actions.INITIAL_FAILURE,
		error,
	};
}
