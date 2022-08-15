import { BaseResponeDetail, BaseResponeList } from 'services/type';
import { PermistionAction } from 'variables/permission';

export enum FeatureModule {
	ADMIN_USER_MANAGEMENT,
	UNIT_MANAGEMENT,
	ROLE_MANAGEMENT,
	AREA_MANAGEMENT,
	FLAT_MANAGEMENT,
	RESIDENT_MANAGEMENT,
	RESIDENT_CARD_MANAGEMENT,
	AMENITIES_GROUP_MANAGEMENT,
	AMENITIES_MANAGEMENT,
	AMENITIES_BOOKING_MANAGEMENT,
	ARTICLE_MANAGEMENT,
}

export interface ResourceRole {
	action: PermistionAction;
	feature: FeatureModule;
	name: string;
}

export interface IRole {
	code: string;
	createdDate: string;
	id: string;
	name: string;
	state: string;
	updatedDate: string;
	privileges: {
		[x in FeatureModule]: Array<PermistionAction>;
	};
}

export type IRoleResponse = BaseResponeList<IRole>;

export interface IRoleParams {
	description: string;
	imageLink: string;
	name: string;
	state: string | number;
	id?: string;
}

export interface IRolePayload {
	description: string;
	imageLink: string;
	name: string;
	state: string | number;
	id?: string;
}

export type IRoleDetail = BaseResponeDetail<IRole>;
