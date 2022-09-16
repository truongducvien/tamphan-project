import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
	loadAccessToken,
	loadRefreshToken,
	loadSessionAccessToken,
	saveAccessToken,
	saveRefreshToken,
} from 'src/helpers/storage';
import { store } from 'src/store';
import { logout } from 'src/store/actionCreators';

import { userRefreshToken } from './user';

let isRetry = false;
let pendingRequests: Array<() => void> = [];

const createHTTP = (httpConfig: AxiosRequestConfig) => {
	const httpInstance = axios.create({
		headers: {
			'Content-Type': 'application/json',
		},
		...httpConfig,
	});

	httpInstance.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			if (!config?.headers) {
				throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
			}
			const accessToken = loadAccessToken() || loadSessionAccessToken();
			const authConfig = {
				authorization: `Bearer ${accessToken || ''}`,
			};

			return {
				...config,
				...(config.headers.authorization !== false
					? {
							headers: authConfig,
					  }
					: {}),
			};
		},
		(error: AxiosError) => {
			return Promise.reject(error);
		},
	);

	httpInstance.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		(error: AxiosError) => {
			if (error.response && error.response.status === 401) {
				if (!isRetry) {
					isRetry = true;
					const refreshingToken = loadRefreshToken();
					if (!refreshingToken) throw Error('dont have refresh token');
					return userRefreshToken(refreshingToken)
						.then(({ data }) => {
							const { accessToken, refreshToken } = data || {};
							if (!accessToken || !refreshToken) throw Error('request fail');
							saveAccessToken(accessToken);
							saveRefreshToken(refreshToken);
							pendingRequests.forEach(cb => cb());
							pendingRequests = [];
							return Promise.resolve(httpInstance(error.config));
						})
						.catch(err => {
							store.dispatch(logout());
							return Promise.reject(err);
						})
						.finally(() => {
							isRetry = false;
						});
				}
				return new Promise(resolve => {
					pendingRequests.push(() => {
						resolve(httpInstance(error.config));
					});
				});
			}
			return Promise.reject(error);
		},
	);

	return httpInstance;
};

export default createHTTP({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});
