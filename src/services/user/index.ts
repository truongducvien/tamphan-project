import http from 'services/http';
import { Gender } from 'services/resident/type';
import { BaseResponeAction, BaseResponeDetail } from 'services/type';

import { IUser, IUserParams, IUserPayload, IUserResponse } from './type';

export interface LoginResponse {
	operatorResponse: {
		address: string;
		areaName: string;
		createdAt: Date;
		dateOfBirth: string;
		email: string;
		fullName: string;
		gender: Gender;
		id: string;
		organizationName: string;
		phoneNumber: string;
		roleId: string;
		roleName: string;
		username: string;
	};
	accessToken: string;
}

export const login = async (payload: { username: string; password: string }) => {
	const { data } = await http.post<BaseResponeDetail<LoginResponse>>(
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
	const { data } = await http.post<BaseResponeAction>('/v1/operators', {
		...payload,
	});
	return data || null;
};

export const deleteUser = async (id: string) => {
	const { data } = await http.delete<BaseResponeAction>(`/v1/operators/${id}`);
	return data || null;
};

export const getUserById = async (id: string) => {
	const { data } = await http.get<BaseResponeDetail<IUser>>(`/v1/operators/${id}`);
	return data || null;
};

export const updateUser = async (payload: IUserPayload) => {
	const { data } = await http.put<BaseResponeAction>(`/v1/operators/${payload.id || ''}`, payload);
	return data || null;
};
