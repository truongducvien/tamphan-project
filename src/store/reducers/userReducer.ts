import * as actions from '../actions';

export interface UserState {
	logined: boolean;
	user: actions.IUser | null;
	loading: boolean;
}

const initialState: UserState = {
	user: null,
	logined: false,
	loading: true,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function userReducer(state: UserState = initialState, action: actions.UserAction): UserState {
	switch (action.type) {
		case actions.LOGIN_SUCCESS:
			return {
				user: action.user,
				logined: true,
				loading: false,
			};
		case actions.INITIAL_SUCESS:
			return {
				...state,
				logined: true,
				loading: false,
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
