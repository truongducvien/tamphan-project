import { IProperty } from '@/services/properties/type';
import { IResident } from '@/services/resident/type';
import { BaseParams, BaseResponseList } from '@/services/type';
import { Status } from '@/variables/status';

export interface IResidentCard {
	cardNumber: string;
	fee: number;
	id: string;
	modifyBy: string;
	property: IProperty;
	resident: IResident;
	state: Status;
	updatedDate: string;
}

export interface IResidentCardParams extends BaseParams {
	propertyId?: string;
	cardNumber?: string;
	state?: Status;
}

export interface IResidentCardImportpayload {
	file: File;
	type: string;
}

export type IResidentCardResponse = BaseResponseList<IResidentCard>;
