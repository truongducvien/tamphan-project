import http from 'services/http';
import { IUser } from 'store/actions';

import { IUserResponse } from './type';

export interface LoginResponse {
	user: IUser;
	accessToken: string;
}

export async function login(payload: { username: string; password: string }) {
	return http.post<LoginResponse>('/v1/operators/login', { ...payload });
}

export const getUser = async () => {
	const { data } = await http.get<IUserResponse>('/v1/admin-users');
	return data;
};
