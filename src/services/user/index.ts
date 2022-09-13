import http from 'services/http';
import { BaseResponseAction, BaseResponseDetail } from 'services/type';

import { IUser, IUserParams, IUserPayload, IUserResponse } from './type';

export interface LoginResponse {
	operatorResponse: IUser;
	accessToken: string;
	refreshToken: string;
}

export const login = async (payload: { username: string; password: string }) => {
	const { data } = await http.post<BaseResponseDetail<LoginResponse>>(
		'/v1/operators/login',
		{ ...payload },
		{ headers: { authorization: false } },
	);
	return data;
};

export const getUser = async (payload: IUserParams) => {
	const { data } = await http.get<IUserResponse>('/v1/operators/search', {
		params: {
			...payload,
		},
	});
	return data?.data || null;
};

export const getAllUser = async () => {
	const { data } = await http.get<IUserResponse>('/v1/operators/all');
	return data?.data || null;
};

export const createUser = async (payload: IUserPayload) => {
	const { data } = await http.post<BaseResponseAction>('/v1/operators', {
		...payload,
	});
	return data || null;
};

export const deleteUser = async (id: string) => {
	const { data } = await http.delete<BaseResponseAction>(`/v1/operators/${id}`);
	return data || null;
};

export const getUserById = async (id: string) => {
	const { data } = await http.get<BaseResponseDetail<IUser>>(`/v1/operators/${id}`);
	return data || null;
};

export const updateUser = async (payload: IUserPayload) => {
	const { data } = await http.put<BaseResponseAction>(`/v1/operators/${payload.id || ''}`, payload);
	return data || null;
};

export const getByAccessToken = async () => {
	const { data } = await http.get<BaseResponseDetail<IUser>>('	/v1/operators/access-token');
	return data || null;
};

export const userRefreshToken = async (refreshToken: string) => {
	const { data } = await http.post<BaseResponseDetail<IUser>>('/v1/operators/refresh-token', { refreshToken });
	return data || null;
};

export const userForgotPass = async (email: string) => {
	const { data } = await http.put<BaseResponseDetail<{ durationInSeconds: number }>>('/v1/operators/forget-password', {
		email,
	});
	return data || null;
};

export const userResetPass = async (payload: { otpToken: string; newPassword: string }) => {
	const { data } = await http.put<BaseResponseDetail<{ durationInSeconds: number }>>(
		'/v1/operators/reset-password',
		payload,
	);
	return data || null;
};
