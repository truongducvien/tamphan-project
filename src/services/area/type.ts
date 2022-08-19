import { Option } from 'components/form/PullDown';
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
	code: string;
	mapLink: string;
	avatarLink: string;
}

export type IAreaResponse = BaseResponeList<IArea>;

export enum TypeArea {
	VILLA = 'VILLA',
	SHOP_HOUSE = 'SHOP_HOUSE',
	SINGLE_VILLA = 'SINGLE_VILLA',
	TOWN_HOUSE = 'TOWN_HOUSE',
}

export const typeAreas: Array<Option> = [
	{
		label: 'Biệt thự',
		value: TypeArea.VILLA,
	},
	{
		label: 'Shophouse',
		value: TypeArea.SHOP_HOUSE,
	},
	{
		label: 'Biệt thự Đơn lập',
		value: TypeArea.SINGLE_VILLA,
	},
	{
		label: 'Nhà Phố',
		value: TypeArea.TOWN_HOUSE,
	},
];

export interface IAreaPayload {
	acreage: string;
	avatarLink?: string;
	contactEmail: string;
	contactPhone: string;
	location: string;
	mapLink?: string;
	name: string;
	id?: string;
	type: TypeArea;
}

export interface IAreaParams extends BaseParams {
	name?: string;
}
