import { Gender } from 'services/resident/type';
import { IRole } from 'services/role/type';
import { BaseParams, BaseResponeList } from 'services/type';
import { Status } from 'variables/status';

export interface IUser {
	areaName: string;
	createdAt: Date;
	dateOfBirth: string;
	areaId: string;
	email: string;
	fullName: string;
	gender: Gender;
	id: string;
	organizationName: string;
	organizationId: string;
	phoneNumber: string;
	roleId: string;
	roleName: string;
	username: string;
	role?: IRole;
	state: Status;
}

export type IUserResponse = BaseResponeList<IUser>;

export interface IUserPayload {
	address: string;
	dateOfBirth: string;
	email: string;
	fullName: string;
	gender: Gender;
	organizationId: string;
	phoneNumber: string;
	roleId: string;
	username: string;
	id?: string;
	state: Status;
}

export interface IUserParams extends BaseParams {
	fullName?: string;
	organizationId?: string;
	username?: string;
}
