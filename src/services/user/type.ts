import { Gender } from 'services/resident/type';
import { FeatureModule } from 'services/role/type';
import { BaseParams, BaseResponeList } from 'services/type';
import { PermistionAction } from 'variables/permission';

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
	role?: { privileges: { [x in FeatureModule]: Array<PermistionAction> } };
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
}

export interface IUserParams extends BaseParams {
	fullName?: string;
	organizationId?: string;
	username?: string;
}
