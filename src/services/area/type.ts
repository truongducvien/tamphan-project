import { BaseParams, BaseResponseList } from 'src/services/type';

export interface IArea {
	name: string;
	acreage: string;
	areaId: string;
	location: string;
	contactPhone: string;
	contactEmail: string;
	updateDate: string;
	id: string;
	code: string;
	mapLink: string[];
	avatarLink: string;
	residentCardTemplateLink: string;
}

export type IAreaResponse = BaseResponseList<IArea>;

export interface IAreaPayload {
	acreage: string;
	avatarLink?: string;
	contactEmail: string;
	contactPhone: string;
	location: string;
	areaId: string;
	mapLink?: string[];
	name: string;
	id?: string;
}

export interface IAreaParams extends BaseParams {
	code?: string;
}
