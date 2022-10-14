import { createContext, Dispatch, useContext, useMemo, useReducer } from 'react';

import axios from 'axios';
import { getFeedbackById } from 'src/services/feedback';
import { IFeedback } from 'src/services/feedback/type';

export interface Value {
	loading: boolean;
	feedbackData: IFeedback | null;
}

const initialState = {
	loading: false,
	feedbackData: null,
};

export enum Action {
	INIT = 'INIT',
	INITSUSCCES = 'INITSUSCCES',
	INITFAILURE = 'INITFAILURE',
}

export type ActionType =
	| {
			type: Action.INIT;
	  }
	| {
			type: Action.INITSUSCCES;
			data: IFeedback;
	  }
	| {
			type: Action.INITFAILURE;
	  };

export const FeedbackContext = createContext<{ state: Value; dispatch: Dispatch<ActionType> }>({
	state: initialState,
	dispatch: () => null,
});

const reducer = (state: Value, action: ActionType): Value => {
	switch (action.type) {
		case Action.INIT:
			return { ...state, loading: true };
		case Action.INITSUSCCES:
			return { feedbackData: action.data, loading: false };
		case Action.INITFAILURE:
			return { feedbackData: null, loading: false };
		default:
			return { ...state };
	}
};

export const FeedbackContextProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = useMemo(() => state, [state]);
	// eslint-disable-next-line react/jsx-no-constructed-context-values
	return <FeedbackContext.Provider value={{ state: value, dispatch }}>{children}</FeedbackContext.Provider>;
};

export const useFeedbackState = () => {
	const { state } = useContext(FeedbackContext);
	return { ...state };
};

export const useFeedbackAction = (id: string) => {
	const { dispatch } = useContext(FeedbackContext);
	const fetchFeedback = async () => {
		dispatch({ type: Action.INIT });
		try {
			const data = await getFeedbackById(id);
			if (!data) throw new Error('fetch fail');
			dispatch({ type: Action.INITSUSCCES, data });
		} catch {
			dispatch({ type: Action.INITFAILURE });
		}
	};
	return { fetchFeedback, refetch: fetchFeedback };
};
