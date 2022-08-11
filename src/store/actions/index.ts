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

export type LyricsAction = LoginAction | LoginSuccessAction | LoginFailureAction;
