import { BaseParams, BaseResponeList } from 'services/type';

export interface IUtilsGroup {
	description: string;
	id: string;
	imageLink: string;
	name: string;
	state: string;
	updatedDate: string;
	termAndCondition: string;
}

export type IUtilsGroupResponse = BaseResponeList<IUtilsGroup>;

export interface IUtilsGroupPayload {
	description: string;
	imageLink: string;
	name: string;
	state: string | number;
	id?: string;
	termAndCondition: string;
}

export interface IUtilsGroupParams extends BaseParams {
	name?: string;
}
