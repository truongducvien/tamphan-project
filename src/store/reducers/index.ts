import { combineReducers } from 'redux';

import errorReducer from './errorReducer';
import isLoadingReducer from './loadingReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
	user: userReducer,
	isLoading: isLoadingReducer,
	error: errorReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
