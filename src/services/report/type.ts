import { BaseOption } from 'src/components/form/PullDown';
import { BaseParams, BaseResponseDetail, BaseResponseList } from 'src/services/type';

import { IProperty } from '../properties/type';
import { IResident } from '../resident/type';

export enum ReportStatus {
	WAITING_APPROVED = 'WAITING_APPROVED',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	CANCEL = 'CANCEL',
}

export enum ReportTypes {
	CONSTRUCTION_REGISTER = 'CONSTRUCTION_REGISTER',
	RESIDENT_CARD_REGISTER = 'RESIDENT_CARD_REGISTER',
	OTHER = 'OTHER',
}

export const reportStatusOption: Array<BaseOption<keyof typeof ReportStatus>> = [
	{
		label: 'Chờ xử lí',
		value: 'WAITING_APPROVED',
		colorScheme: 'yellow',
	},
	{
		label: 'Đã duyệt',
		value: 'APPROVED',
		colorScheme: 'blue',
	},
	{
		label: 'Từ chối',
		value: 'REJECTED',
		colorScheme: 'red',
	},
	{
		label: 'Đã huỷ',
		value: 'CANCEL',
		colorScheme: 'red',
	},
];

export const reportTypeOptions: Array<BaseOption<keyof typeof ReportTypes>> = [
	{
		label: 'Đăng kí thi công',
		value: 'CONSTRUCTION_REGISTER',
		colorScheme: 'blue',
	},
	{
		label: 'Đăng kí thẻ',
		value: 'RESIDENT_CARD_REGISTER',
		colorScheme: 'cyan',
	},
	{
		label: 'Khác',
		value: 'OTHER',
		colorScheme: 'orange',
	},
];

export interface IReport {
	authorizationDetail: string;
	type: ReportTypes;
	authorizedPerson: IResident;
	code: string;
	createdBy: string;
	createdDate: Date;
	effectiveDate: string;
	expiredDate: string;
	hardCopyLinks: string[];
	mandator: IResident;
	modifiedBy: string;
	property: IProperty;
	status: keyof typeof ReportStatus;
	updatedDate: Date;
	id: string;
}

export interface IReportParams extends BaseParams {
	status?: keyof typeof ReportStatus;
	propertyCode?: string;
	reportPersonName?: string;
	areaId?: string;
	type?: keyof typeof ReportTypes;
	from?: string;
	to?: string;
}

export type IReportResponse = BaseResponseList<IReport>;
export type IReportDetail = BaseResponseDetail<IReport>;
