import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const accessToken =
	'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3T2ZwaFdjN2I1dGRKLXU0RDQwckh6VXZxcXZwYmlORVlhXzg5NVNjZ05nIn0.eyJleHAiOjE2NTcwMTg4NDEsImlhdCI6MTY1NzAxODU0MSwianRpIjoiZGU1YjUyN2YtZWNjNi00NzQ1LWI3OWUtOGVkNjZhMWE5YjE2IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmxvY2FsaG9zdDo4MDAwL3JlYWxtcy9kZW1vLnJlYWxtIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjE1ZTc0YjA2LTE0MTItNGQ4Ny05MzQyLTUzMTg2ZmMzNDIxMiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaWVudC5kZW1vIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1kZW1vLnJlYWxtIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiY2xpZW50LmRlbW8iOnsicm9sZXMiOlsidW1hX3Byb3RlY3Rpb24iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImNsaWVudElkIjoiY2xpZW50LmRlbW8iLCJjbGllbnRIb3N0IjoiMTcyLjE4LjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWNsaWVudC5kZW1vIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xOC4wLjEifQ.lscnSMM9f6QEQGSwuNCi-lCvIGa5XMgpAMsF04ix0h71tVrxLtJE_KX5LGo5uCHoxK8MGOAB3L5ATf6eArwzFgceRZz10lEr8N-FS866VcbZhGycDU_oZVB0nXOWrl6PLJbxk31vXnSgB0_8TjvVggMrC6-jXaXWbYmqeufp7aamM6DogDTOg_YWpURuNsW6mOEsap6xAqu2NX6L5h2ME4vNsiryWwLvGD1sKSyuIBJ4DG8lBgxX_3RnzK49eZlgUF0_ojR6wrEp7I9fIenTzAudyoZCWO1Agt_morJICOzu_5kKgOkmwN5cyml5QDusxs2bpQSBILXE--YNgxI54A';

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
			config.headers.Authorization = `Bearer ${accessToken || ''}`;
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
	baseURL: process.env.REACT_APP_API_BASE_URL,
});
