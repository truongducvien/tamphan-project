import { Option } from 'src/components/form/PullDown';
import { RelationshipWithOwner } from 'src/services/properties/type';
import { BaseParams, BaseResponseList } from 'src/services/type';
import { Status } from 'src/variables/status';

export enum ResidentType {
	OWNER = 'OWNER',
	RESIDENT = 'RESIDENT',
}

export const residentType: Array<Option> = [
	{
		label: 'Chủ sở hữu',
		value: ResidentType.OWNER,
		colorScheme: 'cyan',
	},
	{
		label: 'Cư dân',
		value: ResidentType.RESIDENT,
		colorScheme: 'orange',
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
	property: {
		id: string;
		name?: string;
		code: string;
	};
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
	relationship?: RelationshipWithOwner;
}

export interface IResidentParams extends BaseParams {
	code?: string;
	areaId?: string;
	fullName?: string;
}

export type IResidentResponse = BaseResponseList<IResident>;

export interface IResidentPayload extends Omit<IResident, 'property'> {
	propertyId: string;
}
