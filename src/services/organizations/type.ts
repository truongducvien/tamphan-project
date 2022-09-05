import { BaseResponseList } from 'services/type';

export interface IOrganization {
	createdDate: string;
	description: string;
	id: string;
	name: string;
	parentId: string;
	updatedDate: string;
	areas: {
		code: string;
		id: string;
		name: string;
	}[];
}

export type IOrganizationResponse = BaseResponseList<IOrganization>;

export interface IOrganizationPayload {
	description: string;
	name: string;
	parentId: string;
	id?: string;
	areaIds: string[];
}
