import { Action } from 'redux';

export interface IsLoadingState {
	[key: string]: boolean;
}

const getLoadingMatches = (actionType: string) => /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(actionType);

const isLoadingReducer = (action: Action, state: IsLoadingState = {}) => {
	const matches = getLoadingMatches(action.type as string);

	if (!matches) {
		return state;
	}

	const [, requestName, requestStatus] = matches;
	return {
		...state,
		[requestName]: requestStatus === 'REQUEST',
	};
};

export default isLoadingReducer;
