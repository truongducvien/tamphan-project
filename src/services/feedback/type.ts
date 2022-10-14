import { BaseOption } from 'src/components/form/PullDown';
import { BaseParams, BaseResponseDetail, BaseResponseList } from 'src/services/type';

import { IProperty } from '../properties/type';
import { IResident, ResidentType } from '../resident/type';

export enum FeedbackStatus {
	WAITING = 'WAITING',
	PROGRESSING = 'PROGRESSING',
	DONE = 'DONE',
}

export enum FeedbackTypes {
	INFO = 'INFO',
	FEEDBACK = 'FEEDBACK',
	REQUEST = 'REQUEST',
	OTHER = 'OTHER',
}

export enum FeedbackHistoryAction {
	CREATE = 'CREATE',
	RECEIVE = 'RECEIVE',
	CLOSE = 'CLOSE',
}

export const feedbackHistoryAction: Array<BaseOption<keyof typeof FeedbackHistoryAction>> = [
	{
		label: 'Tạo mới',
		value: 'CREATE',
		colorScheme: 'blue',
	},

	{
		label: 'Đã tiếp nhận',
		value: 'RECEIVE',
		colorScheme: 'cyan',
	},
	{
		label: 'Hoàn thành',
		value: 'CLOSE',
		colorScheme: 'red',
	},
];

export const feedbackStatusOption: Array<BaseOption<keyof typeof FeedbackStatus>> = [
	{
		label: 'Chờ xử lí',
		value: 'WAITING',
		colorScheme: 'yellow',
	},
	{
		label: 'Đang xử lí',
		value: 'PROGRESSING',
		colorScheme: 'teal',
	},
	{
		label: 'Từ chối',
		value: 'DONE',
		colorScheme: 'blue',
	},
];

export const feedbackTypeOptions: Array<BaseOption<keyof typeof FeedbackTypes>> = [
	{
		label: 'Yêu cầu hỗ trợ',
		value: 'REQUEST',
		colorScheme: 'blue',
	},
	{
		label: 'Phản ánh',
		value: 'FEEDBACK',
		colorScheme: 'cyan',
	},
	{
		label: 'Góp ý',
		value: 'INFO',
		colorScheme: 'teal',
	},
	{
		label: 'Khác',
		value: 'OTHER',
		colorScheme: 'orange',
	},
];
export interface FeedbackHistories {
	action: FeedbackHistoryAction;
	content: string;
	createdAt: Date;
	createdBy: string;
	fullName: string;
	modifiedAt: Date;
	note: string;
}

export interface IFeedback {
	actualDate: Date;
	areaName: string;
	content: string;
	createdAt: Date;
	expectedDate: Date;
	feedbackHistories: FeedbackHistories[];
	id: string;
	imageLink: string[];
	modifiedAt: Date;
	operatorFullName: string;
	propertyCode: string;
	receiveDate: Date;
	residentFullName: string;
	residentPhoneNumber: string;
	residentType: ResidentType;
	status: FeedbackStatus;
	title: string;
	type: FeedbackTypes;
}

export interface IFeedbackParams extends BaseParams {
	status?: keyof typeof FeedbackStatus;
	propertyId?: string;
	fullName?: string;
	areaId?: string;
	type?: keyof typeof FeedbackTypes;
	from?: string;
	to?: string;
}

export type IFeedbackResponse = BaseResponseList<IFeedback>;
export type IFeedbackDetail = BaseResponseDetail<IFeedback>;
