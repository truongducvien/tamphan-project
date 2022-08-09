import { BaseResponeList } from 'services/type';

export interface IUtils {
	id: string;
	address: string;
	amenitiesGroupId: string;
	areaId: string;
	capacity: number;
	dateOffs: Array<string>;
	depositAmount: number;
	description: string;
	imageLink: string;
	isAllowBookViaApp: true;
	maxOrderNumber: number;
	name: string;
	operatingTime: {
		end: string;
		start: string;
	};
	phoneNumber: string;
	state: string;
	timeSlotType: string;
	timeSlots: [
		{
			end: string;
			start: string;
		},
		{
			end: string;
			start: string;
		},
	];
}

export type IUtilsGroupResponse = BaseResponeList<IUtils>;

export interface IUtilsSearchPayload {
	amenitiesGroupId?: string;
	areaId?: string;
	name?: string;
	page: number;
	size: number;
}

export interface IUtilsCreatePayload {
	id?: string;
	address: string;
	amenitiesGroupId: string;
	areaId: string;
	capacity: number;
	dateOffs: Array<string>;
	depositAmount: number;
	description: string;
	imageLink: string;
	isAllowBookViaApp: boolean;
	maxOrderNumber: number;
	name: string;
	operatingTime:
		| {
				end: string;
				start: string;
		  }
		| string;
	phoneNumber: string;
	state: string;
	timeSlotType: string;
	timeSlots:
		| {
				end: string;
				start: string;
		  }[]
		| string;
}
