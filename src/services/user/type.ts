import { Gender } from 'src/services/resident/type';
import { IRole } from 'src/services/role/type';
import { BaseParams, BaseResponseList } from 'src/services/type';
import { Status } from 'src/variables/status';

export interface IUser {
	accessToken: string;
	refreshToken: string;
	areaName: string;
	createdAt: Date;
	dateOfBirth: string;
	areaId: string;
	avatarLink: string;
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
	isFirstTimeLogin: boolean;
}

export type IUserResponse = BaseResponseList<IUser>;

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
