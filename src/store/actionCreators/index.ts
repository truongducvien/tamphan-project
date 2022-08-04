import * as actions from '../actions';

export function userLogin(username: string, password: string): actions.LoginAction {
	return {
		type: actions.LOGIN_REQUEST,
		username,
		password,
	};
}

export function userLoginSuccess(user: actions.IUser): actions.LoginSuccessAction {
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