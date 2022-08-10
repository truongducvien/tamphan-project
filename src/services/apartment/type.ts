import { Option } from 'components/form/PullDown';
import { BaseParams, BaseResponeList } from 'services/type';

export enum StatusApartment {
	UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
	HAND_OVER = 'HAND_OVER',
	PREPARING_HANDOVER = 'PREPARING_HANDOVER',
	WAITING_HANDOVER = 'WAITING_HANDOVER',
	IN_USE = 'IN_USE',
}

export const statusApartment: Array<Option> = [
	{
		label: 'Đang thi công',
		value: StatusApartment.UNDER_CONSTRUCTION,
	},
	{
		label: 'Bàn giao',
		value: StatusApartment.HAND_OVER,
	},
	{
		label: 'Chuẩn bị bàn giao',
		value: StatusApartment.PREPARING_HANDOVER,
	},
	{
		label: 'Chờ bàn giao',
		value: StatusApartment.WAITING_HANDOVER,
	},
	{
		label: 'Đang sử dụng',
		value: StatusApartment.IN_USE,
	},
];

export interface IApartment {
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
	status: StatusApartment;
	type: string;
}

export type IApartmentResponse = BaseResponeList<IApartment>;

export interface IApartmentPayload {
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
	status: StatusApartment;
	type: string;
	id?: string;
}

export interface IApartmentParams extends BaseParams {
	code?: string;
	areaId?: string;
}