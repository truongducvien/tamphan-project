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
	facilityName: string;
	reservationDate: string;
	cancelDate: string;
	status: string;
	depositAmount: number;
	paymentMethod: string;
	id: string;
}

export type IUtilsGroupResponse = BaseResponeList<IUtilsRe>;

export interface IUtilsReSearchPayload {
	facilityGroupId?: string;
	facilityName?: string;
	areaId?: string;
	bookingFromTime?: string;
	bookingToTime?: string;
	page: number;
	size: number;
}

export interface IUtilsReSearchForm
	extends Omit<IUtilsReSearchPayload, 'page' | 'size' | 'areaId' | 'facilityGroupId'> {
	areaId: Option;
	facilityGroupId: Option;
}
