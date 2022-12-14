import { IUser } from 'src/services/user/type';

import * as actions from '../actions';

export interface UserState {
	logined: boolean;
	info: IUser | null;
	loading: boolean;
}

const initialState: UserState = {
	info: null,
	logined: false,
	loading: true,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function userReducer(state: UserState = initialState, action: actions.UserAction): UserState {
	switch (action.type) {
		case actions.LOGIN_SUCCESS:
			return {
				...state,
				info: action.user,
				logined: true,
				loading: false,
			};
		case actions.INITIAL_SUCESS:
			return {
				...state,
				logined: true,
				loading: false,
				info: action.user,
			};
		case actions.INITIAL_FAILURE:
			return {
				...state,
				logined: false,
				loading: false,
			};
		case actions.LOGOUT_SUCCESS:
			return { ...initialState, loading: false };
		default:
			return state;
	}
}
