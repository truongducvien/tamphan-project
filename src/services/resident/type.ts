import { Option } from 'components/form/PullDown';
import { BaseParams, BaseResponeList } from 'services/type';
import { Status } from 'variables/status';

export enum ResidentType {
	OWNER = 'OWNER',
	RESIDENT = 'RESIDENT',
}

export const residentType: Array<Option> = [
	{
		label: 'Chủ sở hữu',
		value: ResidentType.OWNER,
		tag: 'cyan',
	},
	{
		label: 'Cư dân',
		value: ResidentType.RESIDENT,
		tag: 'orange',
	},
];

export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER = 'OTHER',
}

export const gender: Array<Option> = [
	{
		label: 'Nam',
		value: Gender.MALE,
	},
	{
		label: 'Nữ',
		value: Gender.FEMALE,
	},
	{
		label: 'Khác',
		value: Gender.OTHER,
	},
];

export enum IdentityCardType {
	CMND = 'CMND',
	CCCD = 'CCCD',
	HC = 'HC',
}

export const identityCardType: Array<Option> = [
	{
		label: 'CMND',
		value: IdentityCardType.CMND,
	},
	{
		label: 'CCCD',
		value: IdentityCardType.CCCD,
	},
	{
		label: 'Hộ chiếu',
		value: IdentityCardType.HC,
	},
];

export interface IResident {
	dateOfBirth: string;
	email: string;
	propertyId: string;
	propertyName?: string;
	fullName: string;
	gender: Gender;
	identityCardNumber: string;
	identityCardType: IdentityCardType;
	identityCreateDate: string;
	identityLocationIssued: string;
	permanentAddress: string;
	phoneNumber: string;
	temporaryAddress: string;
	type: ResidentType;
	useNovaId?: boolean;
	state?: Status;
	id: string;
}

export interface IResidentParams extends BaseParams {
	propertyId?: string;
	areaId?: string;
	fullName?: string;
}

export type IResidentResponse = BaseResponeList<IResident>;

export type IResidentPayload = IResident;
