import { BaseParams, BaseResponeDetail, BaseResponeList } from 'services/type';
import { PermistionAction } from 'variables/permission';
import { Status } from 'variables/status';

export enum FeatureModule {
	OPERATION_MANAGEMENT = 'OPERATION_MANAGEMENT',
	ORGANIZATIONS_MANAGEMENT = 'ORGANIZATIONS_MANAGEMENT',
	ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
	AREA_MANAGEMENT = 'AREA_MANAGEMENT',
	PROPERTIES_MANAGEMENT = 'PROPERTIES_MANAGEMENT',
	RESIDENT_MANAGEMENT = 'RESIDENT_MANAGEMENT',
	RESIDENT_CARD_MANAGEMENT = 'RESIDENT_CARD_MANAGEMENT',
	RESIDENT_CARD_REQUEST_MANAGEMENT = 'RESIDENT_CARD_REQUEST_MANAGEMENT',
	RESIDENT_CARD_PROCESS_MANAGEMENT = 'RESIDENT_CARD_PROCESS_MANAGEMENT',
	FACILITY_GROUP_MANAGEMENT = 'FACILITY_GROUP_MANAGEMENT',
	FACILITY_MANAGEMENT = 'FACILITY_MANAGEMENT',
	FACILITY_BOOKING_MANAGEMENT = 'FACILITY_BOOKING_MANAGEMENT',
	ARTICLE_MANAGEMENT = 'ARTICLE_MANAGEMENT',
}

export type FeatureModuleKey = keyof typeof FeatureModule;
export type PermistionActionKey = keyof typeof PermistionAction;

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

export interface IRoleParams extends BaseParams {
	name?: string;
	code?: string;
}

export interface IRolePayload {
	code: string;
	name: string;
	id?: string;
	privilegeRequests?: Array<{
		actions: Array<PermistionActionKey>;
		feature: FeatureModuleKey;
	}>;
	state?: Status;
}

export type IRoleDetail = BaseResponeDetail<IRole>;
