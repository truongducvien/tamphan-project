import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
	const root = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
	sagaMiddleware.run(rootSaga);
	return root;
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const store = configureStore();
