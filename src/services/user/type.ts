import { Gender } from 'services/resident/type';
import { BaseParams, BaseResponeList } from 'services/type';

export interface IUser {
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
}

export type IUserResponse = BaseResponeList<IUser>;

export interface IUserPayload {
	address: string;
	areaId: string;
	dateOfBirth: string;
	email: string;
	fullName: string;
	gender: Gender;
	organizationId: string;
	phoneNumber: string;
	roleId: string;
	username: string;
	id?: string;
}

export interface IUserParams extends BaseParams {
	fullName?: string;
	organizationId?: string;
	username?: string;
}
