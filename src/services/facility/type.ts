import { BaseOption } from 'components/form/PullDown';
import { BaseResponseList } from 'services/type';

export type TimeSlotType = 'HOUR' | 'DATE';

export const timeSlotTypeOption: BaseOption<TimeSlotType>[] = [
	{ label: 'HOUR', value: 'HOUR' },
	{ label: 'DATE', value: 'DATE' },
];
export interface IFacility {
	id: string;
	address: string;
	facilityGroupId: string;
	facilityGroupName: string;
	areaId: string;
	areaName: string;
	capacity: number;
	dateOffs: Array<string>;
	depositAmount: string;
	depositNote: string;
	description: string;
	imageLink: string[];
	depositInDuration: number;
	isAllowBookViaApp: true;
	maxOrderNumber: number;
	name: string;
	operatingTime: {
		end: string;
		start: string;
	};
	phoneNumber: string;
	state: string;
	timeSlotType: TimeSlotType;
	timeSlots: {
		end: string;
		start: string;
	}[];
}

export type IFacilityGroupResponse = BaseResponseList<IFacility>;

export interface IFacilitySearchPayload {
	facilityGroupId?: string;
	areaId?: string;
	name?: string;
	page: number;
	size: number;
}

export interface IFacilityCreatePayload {
	id?: string;
	address: string;
	facilityGroupId: string;
	areaId: string;
	capacity: number;
	dateOffs?: Array<string>;
	depositAmount: number;
	description: string;
	imageLink: string[];
	isAllowBookViaApp: boolean;
	maxOrderNumber: number;
	depositNote: string;
	name: string;
	depositInDuration: number;
	operatingTime:
		| {
				end: string;
				start: string;
		  }
		| string;
	phoneNumber: string;
	state: string;
	timeSlotType: TimeSlotType;
	timeSlots:
		| {
				end: string;
				start: string;
		  }[]
		| string;
}
