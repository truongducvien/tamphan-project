import { Option } from 'components/form/PullDown';
import { BaseResponeList } from 'services/type';

export interface IUtilsRe {
	bookingTimeSlot: {
		start: string;
		end: string;
	};
	quantityOfPerson: number;
	note: string;
	phoneNumber: string;
	userName: string;
	amenitiesName: string;
	reservationDate: string;
	cancelDate: string;
	status: string;
	depositAmount: number;
	paymentMethod: string;
	id: string;
}

export type IUtilsGroupResponse = BaseResponeList<IUtilsRe>;

export interface IUtilsReSearchPayload {
	amenitiesGroupId?: string;
	amenitiesName?: string;
	areaId?: string;
	bookingFromTime?: string;
	bookingToTime?: string;
	page: number;
	size: number;
}

export interface IUtilsReSearchForm
	extends Omit<IUtilsReSearchPayload, 'page' | 'size' | 'areaId' | 'amenitiesGroupId'> {
	areaId: Option;
	amenitiesGroupId: Option;
}
