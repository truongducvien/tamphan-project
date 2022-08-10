import { BaseResponeList } from 'services/type';

export interface IOffice {
	createdDate: string;
	description: string;
	id: string;
	name: string;
	parentId: string;
	updatedDate: string;
}

export type IOfficeResponse = BaseResponeList<IOffice>;

export interface IOfficePayload {
	description: string;
	name: string;
	parentId: string;
	id?: string;
}
