import { Option } from 'components/form/PullDown';
import { TypeArea } from 'services/area/type';
import { BaseParams, BaseResponeList } from 'services/type';

export enum NotificationWays {
	EMAIL = 'EMAIL',
	APP_NOTIFICATION = 'APP_NOTIFICATION',
}

export const notificationWays: Array<Option> = [
	{
		label: 'Gửi qua ứng dụng',
		value: NotificationWays.APP_NOTIFICATION,
		tag: 'purple',
	},
	{
		label: 'Gửi qua mail',
		value: NotificationWays.EMAIL,
		tag: 'teal',
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
	avatarLink?: string;
	content: string;
	contentLink: string;
	createdAt: Date;
	id: string;
	notificationWays: Array<NotificationWays>;
	shortContent: string;
	status: StatusArticle;
	thumbnailLink?: string;
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
		tag: 'gray',
	},
	{
		label: 'Chờ duyệt',
		value: StatusArticle.WAITING_APPROVE,
		tag: 'yellow',
	},
	{
		label: 'Xuất bản',
		value: StatusArticle.PUBLISH,
		tag: 'green',
	},
	{
		label: 'Từ chối',
		value: StatusArticle.REJECT,
		tag: 'red',
	},
	{
		label: 'Vô hiệu',
		value: StatusArticle.CANCEL,
		tag: 'gray',
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
		value: TypeArticle.PROMOTION,
		tag: 'cyan',
	},
	{
		label: 'Tin tức',
		value: TypeArticle.NEWS,
		tag: 'pink',
	},
	{
		label: 'Bản tin cư dân',
		value: TypeArticle.RESIDENT_NEWS,
		tag: 'orange',
	},
	{
		label: 'Thông báo',
		value: TypeArticle.NOTIFICATION,
		tag: 'blue',
	},
	{
		label: 'Sổ tay cư dân',
		value: TypeArticle.RESIDENT_HANDBOOK,
		tag: 'purple',
	},
];

export interface IArticlePayload {
	areaIds: Array<string>;
	avatarLink?: string;
	content: string;
	contentLink: string;
	notificationWays: Array<NotificationWays>;
	shortContent: string;
	status: StatusArticle;
	thumbnailLink?: string;
	title: string;
	type: TypeArticle;
	id?: string;
}

export interface IArticleParams extends BaseParams {
	keyword?: string;
}
