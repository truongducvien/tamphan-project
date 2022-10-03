import { BaseOption, Option } from 'src/components/form/PullDown';
import { BaseParams, BaseResponseList } from 'src/services/type';

import { StatusProperty, TypeProperty } from '../properties/type';

enum HandOverBookingStatus {
	NOT_SCHEDULED = 'NOT_SCHEDULED',
	WAITING = 'WAITING',
	CANCEL = 'CANCEL',
	DONE = 'DONE',
	APPROVED = 'APPROVED',
}
export type HandOverBookingStatusKey = keyof typeof HandOverBookingStatus;

export const handOverBookingStatus: Array<BaseOption<HandOverBookingStatusKey>> = [
	{
		label: 'Chưa đặt lịch',
		value: 'NOT_SCHEDULED',
		colorScheme: 'gray',
	},
	{
		label: 'Đang xử lý',
		value: 'WAITING',
		colorScheme: 'yellow',
	},
	{
		label: 'Đã huỷ',
		value: 'CANCEL',
		colorScheme: 'red',
	},
	{
		label: 'Hoàn tất',
		value: 'DONE',
		colorScheme: 'cyan',
	},
	{
		label: 'Đã xác nhận',
		value: 'APPROVED',
		colorScheme: 'orange',
	},
];

export interface IHandover {
	bookingStatus: HandOverBookingStatus;
	createdDate: Date;
	id: string;
	property: {
		areaCode: string;
		areaImageLink: string;
		areaName: string;
		code: string;
		id: string;
		name: string;
		status: StatusProperty;
		type: TypeProperty;
	};
	residentFullName: string;
	residentPhoneNumber: string;
	updatedDate: Date;
}

export type IHandoverResponse = BaseResponseList<IHandover>;

export type IHandoverPayload = BaseParams;

export interface IHandoverParams extends BaseParams {
	code?: string;
	fullName?: string;
	status?: StatusProperty;
	bookingStatus?: HandOverBookingStatusKey;
}
