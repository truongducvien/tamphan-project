import { IRole } from 'services/role/type';

export interface IUser {
	username: string;
}

export const LOGIN_REQUEST = 'users/LOGIN_REQUEST';

export interface LoginAction {
	type: typeof LOGIN_REQUEST;
	username: string;
	password: string;
	remember?: boolean;
}

export const LOGIN_SUCCESS = 'users/LOGIN_SUCCESS';
export interface LoginSuccessAction {
	type: typeof LOGIN_SUCCESS;
	user: IUser;
}

export const LOGIN_FAILURE = 'users/LOGIN_FAILURE';
export interface LoginFailureAction {
	type: typeof LOGIN_FAILURE;
	error: Error | string;
}

export const LOGOUT_REQUEST = 'users/LOGOUT_REQUEST';

export interface LogoutAction {
	type: typeof LOGOUT_REQUEST;
}

export const LOGOUT_SUCCESS = 'users/LOGOUT_SUCCESS';

export interface LogoutSuccessAction {
	type: typeof LOGOUT_SUCCESS;
}

export const INITIAL = 'users/INITIAL';

export interface InitialAction {
	type: typeof INITIAL;
}

export const INITIAL_SUCESS = 'users/INITIAL_SUCESS';

export interface InitialSuscessAction {
	type: typeof INITIAL_SUCESS;
	privileges: IRole['privileges'];
}

export const INITIAL_FAILURE = 'users/INITIAL_FAILURE';

export interface InitiaFailurelAction {
	type: typeof INITIAL_FAILURE;
	error: Error | string;
}

export type UserAction =
	| LoginAction
	| LoginSuccessAction
	| LoginFailureAction
	| InitialAction
	| InitialSuscessAction
	| InitiaFailurelAction
	| LogoutAction
	| LogoutSuccessAction;
