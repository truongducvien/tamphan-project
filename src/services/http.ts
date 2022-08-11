import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { loadAccessToken } from 'helpers/storage';

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
			if (!config.headers.authorization) {
				const accessToken = loadAccessToken();
				config.headers.authorization = `Bearer ${accessToken || ''}`;
			}
			return config;
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
			return Promise.reject(error);
		},
	);

	return httpInstance;
};

export default createHTTP({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});
