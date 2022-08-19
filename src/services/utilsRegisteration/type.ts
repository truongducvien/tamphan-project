import { Option } from 'components/form/PullDown';
import { BaseResponeList } from 'services/type';

export enum PaymentMethod {
	CASH = 'CASH',
	BANK = 'BANK',
}

export const paymentMethods = [
	{
		label: 'Tiền mặt',
		value: PaymentMethod.CASH,
	},
	{
		label: 'Chuyển khoản',
		value: PaymentMethod.BANK,
	},
];

export enum StatusUtilsRe {
	DONE = 'DONE',
	WAITING = 'WAITING',
	PAYMENT_WAITING = 'PAYMENT_WAITING',
	CANCEL = 'CANCEL',
}

export const statusUtilsRe = [
	{
		label: 'Hoàn tất',
		value: StatusUtilsRe.DONE,
	},
	{
		label: 'Đang đợi',
		value: StatusUtilsRe.WAITING,
	},
	{
		label: 'Đợi thanh toán',
		value: StatusUtilsRe.PAYMENT_WAITING,
	},
];

export interface IUtilsRe {
	bookingTimeSlot: {
		start: string;
		end: string;
	};
	bookingCode: string;
	quantityOfPerson: number;
	note: string;
	phoneNumber: string;
	userName: string;
	facilityName: string;
	reservationDate: string;
	cancelDate: string;
	status: string;
	depositAmount: number;
	paymentMethod: PaymentMethod;
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
