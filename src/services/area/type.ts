import { BaseParams, BaseResponeList } from 'services/type';

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
export interface IAreaPayload {
	description: string;
	imageLink: string;
	name: string;
	state: string | number;
	id?: string;
}

export interface IAreaParams extends BaseParams {
	name?: string;
}
