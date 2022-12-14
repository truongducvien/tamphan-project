import { BaseOption } from 'src/components/form/PullDown';
import { BaseParams, BaseResponseDetail, BaseResponseList } from 'src/services/type';
import { Status } from 'src/variables/status';

import { IProperty } from '../properties/type';
import { IResident } from '../resident/type';

export enum ResidentAuthReqStatus {
	WAITING_APPROVED = 'WAITING_APPROVED',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	CANCEL = 'CANCEL',
}

export enum AuthorizationItem {
	CONSTRUCTION_REGISTER = 'CONSTRUCTION_REGISTER',
	RESIDENT_CARD_REGISTER = 'RESIDENT_CARD_REGISTER',
	OTHER = 'OTHER',
}

export const authorizationStatusOption: Array<BaseOption<keyof typeof ResidentAuthReqStatus>> = [
	{
		label: 'Chờ xử lý',
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

export const authorizationItemOption: Array<BaseOption<keyof typeof AuthorizationItem>> = [
	{
		label: 'Đăng ký thi công',
		value: 'CONSTRUCTION_REGISTER',
		colorScheme: 'blue',
	},
	{
		label: 'Đăng ký thẻ',
		value: 'RESIDENT_CARD_REGISTER',
		colorScheme: 'cyan',
	},
	{
		label: 'Khác',
		value: 'OTHER',
		colorScheme: 'orange',
	},
];

export interface IResidentAuthReq {
	authorizationDetail: string;
	authorizationItem: AuthorizationItem;
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
	status: keyof typeof ResidentAuthReqStatus;
	updatedDate: Date;
	id: string;
}

export interface IResidentAuthReqParams extends BaseParams {
	status?: keyof typeof ResidentAuthReqStatus;
	propertyCode?: string;
	authorizedName?: string;
	areaId?: string;
	mandatorName?: string;
}

export type IResidentAuthReqResponse = BaseResponseList<IResidentAuthReq>;
export type IResidentAuthReqDetail = BaseResponseDetail<IResidentAuthReq>;
