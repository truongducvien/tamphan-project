import { BaseParams, BaseResponseList } from 'services/type';

export interface IFacilityGroup {
	description: string;
	id: string;
	imageLink: string;
	name: string;
	state: string;
	updatedDate: string;
	termAndCondition: string;
}

export type IFacilityGroupResponse = BaseResponseList<IFacilityGroup>;

export interface IFacilityGroupPayload {
	description: string;
	imageLink: string;
	name: string;
	state: string | number;
	id?: string;
	termAndCondition: string;
}

export interface IFacilityGroupParams extends BaseParams {
	name?: string;
}
