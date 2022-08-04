import * as actions from '../actions';

export interface UserState {
	user: actions.IUser | null;
}

const initialState: UserState = {
	user: null,
};

export default function userReducer(action: actions.LyricsAction, state: UserState = initialState): UserState {
	switch (action.type) {
		case actions.LOGIN_SUCCESS:
			return {
				user: action.user,
			};
		default:
			return state;
	}
}
