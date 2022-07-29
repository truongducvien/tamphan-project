import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const createHTTP = (httpConfig: AxiosRequestConfig) => {
	const httpInstance = axios.create({
		headers: {
			'Content-Type': 'application/json',
			typeEndPoint: 'WEB',
			deviceId: 'WEB',
		},
		...httpConfig,
	});

	httpInstance.interceptors.request.use(
		(config: AxiosRequestConfig) => {
			return config;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error: AxiosError<any>) => {
			return Promise.reject(error);
		},
	);

	httpInstance.interceptors.response.use(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(response: AxiosResponse<any>) => {
			return response;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error: AxiosError<any>) => {
			return Promise.reject(error);
		},
	);

	return httpInstance;
};

export default createHTTP({
	baseURL: `https://example.con`,
});
