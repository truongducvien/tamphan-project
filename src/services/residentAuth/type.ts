import { BaseOption } from 'src/components/form/PullDown';
import { BaseParams, BaseResponseDetail, BaseResponseList } from 'src/services/type';
import { Status } from 'src/variables/status';

import { IProperty } from '../properties/type';
import { IResident } from '../resident/type';

export enum AuthorizationItem {
	CONSTRUCTION_REGISTER = 'CONSTRUCTION_REGISTER',
	RESIDENT_CARD_REGISTER = 'RESIDENT_CARD_REGISTER',
	OTHER = 'OTHER',
}

export const authorizationItemOption: Array<BaseOption<keyof typeof AuthorizationItem>> = [
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

export interface IResidentAuth {
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
	status: keyof typeof Status;
	updatedDate: Date;
	id: string;
}

export interface IResidentAuthParams extends BaseParams {
	state?: keyof typeof Status;
	propertyCode?: string;
	authorizedPersonName?: string;
	areaId?: string;
}

export type IResidentAuthResponse = BaseResponseList<IResidentAuth>;
export type IResidentAuthDetail = BaseResponseDetail<IResidentAuth>;
