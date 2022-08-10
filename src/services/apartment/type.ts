import { BaseParams, BaseResponeList } from 'services/type';

export enum StatusApartment {
	UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
	HAND_OVER = 'HAND_OVER',
	PREPARING_HANDOVER = 'PREPARING_HANDOVER',
	WAITING_HANDOVER = 'WAITING_HANDOVER',
	IN_USE = 'IN_USE',
}

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
	status: string;
	type: string;
}

export type IApartmentResponse = BaseResponeList<IApartment>;

export type IApartmentPayload = IApartment;

export interface IApartmentParams extends BaseParams {
	code?: string;
	areaId?: string;
}
