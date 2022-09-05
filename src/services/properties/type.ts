import { Option } from 'components/form/PullDown';
import { BaseParams, BaseResponseList } from 'services/type';

export enum StatusProperty {
	UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
	HAND_OVER = 'HAND_OVER',
	PREPARING_HANDOVER = 'PREPARING_HANDOVER',
	WAITING_HANDOVER = 'WAITING_HANDOVER',
	IN_USE = 'IN_USE',
}

export const statusProperty: Array<Option> = [
	{
		label: 'Đang thi công',
		value: StatusProperty.UNDER_CONSTRUCTION,
		colorScheme: 'gray',
	},
	{
		label: 'Đã bàn giao',
		value: StatusProperty.HAND_OVER,
		colorScheme: 'green',
	},
	{
		label: 'Chuẩn bị bàn giao',
		value: StatusProperty.PREPARING_HANDOVER,
		colorScheme: 'yellow',
	},
	{
		label: 'Chờ bàn giao',
		value: StatusProperty.WAITING_HANDOVER,
		colorScheme: 'orange',
	},
	{
		label: 'Đang sử dụng',
		value: StatusProperty.IN_USE,
		colorScheme: 'blue',
	},
];

export interface IProperty {
	acreage: number;
	address: string;
	areaId: string;
	areaName: string;
	block: string;
	code: string;
	currentNumberResident: number;
	description: string;
	direction: string;
	floorNumber: number;
	id: string;
	inUserAcreage: number;
	maxResident: number;
	name: string;
	numberOfBathRoom: number;
	numberOfBedRoom: number;
	numberOfFloor: number;
	status: StatusProperty;
	type: string;
}

export type IPropertyResponse = BaseResponseList<IProperty>;

export interface IPropertyPayload {
	acreage: number;
	address: string;
	areaId: string;
	block: string;
	code: string;
	description: string;
	direction: string;
	floorNumber: number;
	inUserAcreage: number;
	maxResident: number;
	name: string;
	numberOfBathRoom: number;
	numberOfBedRoom: number;
	numberOfFloor: number;
	status: StatusProperty;
	type: string;
	id?: string;
}

export interface IPropertyParams extends BaseParams {
	code?: string;
	areaId?: string;
}

export interface UpdateOwnerPayload {
	newOwner: string;
	id: string;
}
