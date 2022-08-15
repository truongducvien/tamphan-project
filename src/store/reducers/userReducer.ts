import { IRole } from 'services/role/type';

import * as actions from '../actions';

export interface UserState {
	logined: boolean;
	user: actions.IUser | null;
	loading: boolean;
	privileges: IRole['privileges'] | null;
}

const initialState: UserState = {
	user: null,
	logined: false,
	loading: true,
	privileges: null,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function userReducer(state: UserState = initialState, action: actions.UserAction): UserState {
	switch (action.type) {
		case actions.LOGIN_SUCCESS:
			return {
				...state,
				user: action.user,
				logined: true,
				loading: false,
			};
		case actions.INITIAL_SUCESS:
			return {
				...state,
				logined: true,
				loading: false,
				privileges: action.privileges,
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
