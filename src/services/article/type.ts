import { Option } from 'components/form/PullDown';
import { TypeArea } from 'services/area/type';
import { BaseParams, BaseResponeList } from 'services/type';

export enum NotificationWays {
	EMAIL = 'EMAIL',
	APP_NOTIFICATION = 'APP_NOTIFICATION',
}

export const notificationWays: Array<Option> = [
	{
		label: 'Gửi qua úng dụng',
		value: NotificationWays.APP_NOTIFICATION,
	},
	{
		label: 'Gửi qua mail',
		value: NotificationWays.EMAIL,
	},
];

export interface IArticle {
	areas: [
		{
			acreage: string;
			avatarLink: string;
			contactEmail: string;
			contactPhone: string;
			id: string;
			location: string;
			mapLink: string;
			name: string;
			type: TypeArea;
			updateDate: string;
		},
	];
	avatarLink: string;
	content: string;
	contentLink: string;
	createdAt: Date;
	id: string;
	notificationWays: Array<NotificationWays>;
	shortContent: string;
	status: StatusArticle;
	thumbnailLink: string;
	title: string;
	type: TypeArticle;
}

export type IArticleResponse = BaseResponeList<IArticle>;

export enum StatusArticle {
	DRAFT = 'DRAFT',
	WAITING_APPROVE = 'WAITING_APPROVE',
	PUBLISH = 'PUBLISH',
	REJECT = 'REJECT',
	CANCEL = 'CANCEL',
}

export const statusArticle: Array<Option> = [
	{
		label: 'Bản nháp',
		value: StatusArticle.DRAFT,
	},
	{
		label: 'Chờ duyệt',
		value: StatusArticle.WAITING_APPROVE,
	},
	{
		label: 'Xuất bản',
		value: StatusArticle.PUBLISH,
	},
	{
		label: 'Từ chối',
		value: StatusArticle.REJECT,
	},
	{
		label: 'Vô hiệu',
		value: StatusArticle.CANCEL,
	},
];

export enum TypeArticle {
	NEWS = 'NEWS',
	PROMOTION = 'PROMOTION',
	RESIDENT_NEWS = 'RESIDENT_NEWS',
	NOTIFICATION = 'NOTIFICATION',
	RESIDENT_HANDBOOK = 'RESIDENT_HANDBOOK',
}

export const typeArticles: Array<Option> = [
	{
		label: 'Ưu đãi',
		value: TypeArticle.NEWS,
	},
	{
		label: 'Tin tức',
		value: TypeArticle.PROMOTION,
	},
	{
		label: 'Bản tin cư dân',
		value: TypeArticle.RESIDENT_NEWS,
	},
	{
		label: 'Thông báo',
		value: TypeArticle.NOTIFICATION,
	},
	{
		label: 'Sổ tay cư dân',
		value: TypeArticle.RESIDENT_HANDBOOK,
	},
];

export interface IArticlePayload {
	acreage: string;
	avatarLink?: string;
	contactEmail: string;
	contactPhone: string;
	location: string;
	mapLink?: string;
	name: string;
	id?: string;
	type: TypeArticle;
}

export interface IArticleParams extends BaseParams {
	keyword?: string;
}
