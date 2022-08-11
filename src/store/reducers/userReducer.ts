import * as actions from '../actions';

export interface UserState {
	logined: boolean;
	user: actions.IUser | null;
}

const initialState: UserState = {
	user: null,
	logined: false,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function userReducer(state: UserState = initialState, action: actions.LyricsAction): UserState {
	switch (action.type) {
		case actions.LOGIN_SUCCESS:
			return {
				user: action.user,
				logined: true,
			};
		default:
			return state;
	}
}
