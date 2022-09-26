import { IProperty } from 'src/services/properties/type';
import { IResident } from 'src/services/resident/type';
import { BaseParams, BaseResponseList } from 'src/services/type';
import { Status } from 'src/variables/status';

export interface IResidentCard {
	cardNumber: string;
	fee: number;
	id: string;
	modifyBy: string;
	property: IProperty;
	resident: IResident;
	state: Status;
	updatedDate: string;
	modifiedAt: Date;
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
