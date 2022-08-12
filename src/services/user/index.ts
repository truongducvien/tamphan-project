import http from 'services/http';
import { Gender } from 'services/resident/type';
import { BaseResponeDetail } from 'services/type';

import { IUserResponse } from './type';

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
	const { data } = await http.post<BaseResponeDetail<LoginResponse>>('/v1/operators/login', { ...payload });
	return data;
};

export const getUser = async () => {
	const { data } = await http.get<IUserResponse>('/v1/admin-users');
	return data;
};
