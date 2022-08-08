import { BaseResponeList } from 'services/type';

export interface IUtilsGroup {
	description: string;
	id: string;
	imageLink: string;
	name: string;
	state: string;
	updatedDate: string;
}

export type IUtilsGroupResponse = BaseResponeList<IUtilsGroup>;
