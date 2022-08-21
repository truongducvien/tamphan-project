import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { loadAccessToken, loadSessionAccessToken } from 'helpers/storage';
import { store } from 'store';
import { logout } from 'store/actionCreators';

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
			if (error.response?.status === 401) {
				store.dispatch(logout());
			}

			return Promise.reject(error);
		},
	);

	return httpInstance;
};

export default createHTTP({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});
