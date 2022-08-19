import { IApartment } from 'services/apartment/type';
import { IResident } from 'services/resident/type';
import { BaseParams, BaseResponeList } from 'services/type';
import { Status } from 'variables/status';

export interface IResidentCard {
	cardNumber: string;
	fee: number;
	id: string;
	modifyBy: string;
	property: IApartment;
	resident: IResident;
	state: Status;
	updatedDate: string;
}

export interface IResidentCardParams extends BaseParams {
	propertyId?: string;
	cardNumber?: string;
	state?: Status;
}

export type IResidentCardResponse = BaseResponeList<IResidentCard>;