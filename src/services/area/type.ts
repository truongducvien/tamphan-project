import { BaseResponeList } from 'services/type';

export interface IArea {
	name: string;
	acreage: string;
	location: string;
	contactPhone: string;
	contactEmail: string;
	type: string;
	updateDate: string;
	id: string;
}

export type IAreaResponse = BaseResponeList<IArea>;
