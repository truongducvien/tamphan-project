import { IUser } from 'src/services/user/type';

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
	user: IUser;
}

export const INITIAL_FAILURE = 'users/INITIAL_FAILURE';

export interface InitiaFailurelAction {
	type: typeof INITIAL_FAILURE;
	error: Error | string;
}

export const CHANGE_AVARTAR = 'users/CHANGE_AVARTAR';

export interface ChangeAvatarAction {
	type: typeof CHANGE_AVARTAR;
	link: string;
}

export const CHANGE_AVARTAR_SUCESS = 'users/CHANGE_AVARTAR_SUCESS';

export interface ChangeAvatarSuscessAction {
	type: typeof CHANGE_AVARTAR_SUCESS;
	user: IUser;
}

export const CHANGE_AVARTAR_FAILURE = 'users/INITIAL_FAILURE';

export interface ChangeAvatarFailurelAction {
	type: typeof CHANGE_AVARTAR_FAILURE;
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
	| LogoutSuccessAction
	| ChangeAvatarAction
	| ChangeAvatarSuscessAction
	| ChangeAvatarFailurelAction;
