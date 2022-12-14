import { Option } from 'src/components/form/PullDown';
import { BaseResponseList } from 'src/services/type';

export enum PaymentMethod {
	CASH = 'CASH',
	BANK = 'BANK',
}

export const paymentMethods: Array<Option> = [
	{
		label: 'Tiền mặt',
		value: PaymentMethod.CASH,
		colorScheme: 'green',
	},
	{
		label: 'Chuyển khoản',
		value: PaymentMethod.BANK,
		colorScheme: 'blue',
	},
];

export enum StatusFacilityRe {
	DONE = 'DONE',
	WAITING = 'WAITING',
	PAYMENT_WAITING = 'PAYMENT_WAITING',
	CANCEL = 'CANCEL',
	OVERDUE_DEPOSIT = 'OVERDUE_DEPOSIT',
}

export const statusFacilityRe: Array<Option> = [
	{
		label: 'Hoàn tất',
		value: StatusFacilityRe.DONE,
		colorScheme: 'cyan',
	},
	{
		label: 'Đang đợi',
		value: StatusFacilityRe.WAITING,
		colorScheme: 'yellow',
	},
	{
		label: 'Đợi thanh toán',
		value: StatusFacilityRe.PAYMENT_WAITING,
		colorScheme: 'orange',
	},
	{
		label: 'Quá hạn cọc',
		value: StatusFacilityRe.OVERDUE_DEPOSIT,
		colorScheme: 'red',
	},
	{
		label: 'Đã hủy',
		value: StatusFacilityRe.CANCEL,
		colorScheme: 'red',
	},
];

export interface IFacilityRe {
	bookingTimeSlot: {
		start: string;
		end: string;
	};
	bookingCode: string;
	quantityOfPerson: number;
	areaName: string;
	note: string;
	phoneNumber: string;
	userName: string;
	propertyCode: string;
	facilityName: string;
	reservationDate: string;
	residentEmail: string;
	cancelDate: string;
	status: string;
	depositAmount: {
		amount: number;
		currency: string;
	};
	paymentMethod: PaymentMethod;
	paymentDate: string;
	id: string;
	createdAt: string;
}

export type IFacilityGroupResponse = BaseResponseList<IFacilityRe>;

export interface IFacilityReSearchPayload {
	facilityGroupId?: string;
	facilityName?: string;
	areaId?: string;
	bookingFromTime?: string;
	bookingToTime?: string;
	page: number;
	size: number;
}

export interface IFacilityReSearchForm
	extends Omit<IFacilityReSearchPayload, 'page' | 'size' | 'areaId' | 'facilityGroupId' | 'depositAmount'> {
	areaId: Option;
	facilityGroupId: Option;
	depositAmount: number;
	bookingFromTime: string;
	bookingToTime: string;
}
