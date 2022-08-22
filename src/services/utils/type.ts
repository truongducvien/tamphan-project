import { BaseOption } from 'components/form/PullDown';
import { BaseResponeList } from 'services/type';

export type TimeSlotType = 'HOUR' | 'DATE';

export const timeSlotTypeOption: BaseOption<TimeSlotType>[] = [
	{ label: 'HOUR', value: 'HOUR' },
	{ label: 'DATE', value: 'DATE' },
];
export interface IUtils {
	id: string;
	address: string;
	facilityGroupId: string;
	areaId: string;
	capacity: number;
	dateOffs: Array<string>;
	depositAmount: number;
	description: string;
	imageLink: string[];
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
	facilityGroupId?: string;
	areaId?: string;
	name?: string;
	page: number;
	size: number;
}

export interface IUtilsCreatePayload {
	id?: string;
	address: string;
	facilityGroupId: string;
	areaId: string;
	capacity: number;
	dateOffs: Array<string>;
	depositAmount: number;
	description: string;
	imageLink: string[];
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
	timeSlotType: TimeSlotType;
	timeSlots:
		| {
				end: string;
				start: string;
		  }[]
		| string;
}
