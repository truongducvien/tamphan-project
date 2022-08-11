import { Action } from 'redux';

export interface IsLoadingState {
	[key: string]: boolean;
}

const getLoadingMatches = (actionType: string) => /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(actionType);

// eslint-disable-next-line @typescript-eslint/default-param-last
const isLoadingReducer = (state: IsLoadingState = {}, action: Action) => {
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
