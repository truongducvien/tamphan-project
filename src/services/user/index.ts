import http from 'services/http';
import { IUser } from 'store/actions';

export interface LoginResponse {
	user: IUser;
	token: string;
}

export async function login(username: string, pass: string) {
	return http.post<LoginResponse>('login', { username, pass });
}
