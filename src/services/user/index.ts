import http from 'services/http';
import { IUser } from 'store/actions';

import { IUserResponse } from './type';

export interface LoginResponse {
	user: IUser;
	token: string;
}

export async function login(username: string, pass: string) {
	return http.post<LoginResponse>('login', { username, pass });
}

export const getUser = async () => {
	const { data } = await http.get<IUserResponse>('/v1/admin-users');
	return data;
};
