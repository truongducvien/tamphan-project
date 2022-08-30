import { BaseOption } from 'components/form/PullDown';
import { BaseParams, BaseResponeDetail, BaseResponeList } from 'services/type';

enum StatusCardReq {
	WAITING = 'WAITING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
	CANCEL = 'CANCEL',
}

enum TypeCardReq {
	CREATE_NEW = 'CREATE_NEW',
	RE_NEW = 'RE_NEW',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	CANCEL = 'CANCEL',
}

export const statusCardReq: Array<BaseOption<keyof typeof StatusCardReq>> = [
	{
		label: 'Chờ duyệt',
		value: 'WAITING',
		colorScheme: 'orange',
	},
	{
		label: 'Đã duyệt',
		value: 'ACCEPTED',
		colorScheme: 'teal',
	},
	{
		label: 'Từ chối',
		value: 'REJECTED',
		colorScheme: 'red',
	},
	{
		label: 'Đã huỷ',
		value: 'CANCEL',
		colorScheme: 'red',
	},
];

export const typeCardReq: Array<BaseOption<keyof typeof TypeCardReq>> = [
	{
		label: 'Tạo mới thẻ',
		value: 'CREATE_NEW',
		colorScheme: 'blue',
	},
	{
		label: 'Cấp lại thẻ',
		value: 'RE_NEW',
		colorScheme: 'orange',
	},
	{
		label: 'Mở thẻ',
		value: 'ACTIVE',
		colorScheme: 'cyan',
	},
	{
		label: 'Khoá thẻ',
		value: 'INACTIVE',
		colorScheme: 'red',
	},
	{
		label: 'Huỷ thẻ',
		value: 'CANCEL',
		colorScheme: 'red',
	},
];

export interface IResidentCardReq {
	approvalDate: Date;
	approvalNote: string;
	currentCardNumber: string;
	fee: number;
	id: string;
	newCardNumber: string;
	note: string;
	propertyCode: string;
	requestedDate: Date;
	requesterName: string;
	requesterPhoneNumber: string;
	status: keyof typeof StatusCardReq;
	type: keyof typeof TypeCardReq;
}

export interface IResidentCardReqParams extends BaseParams {
	from?: string;
	fullName?: string;
	propertyId?: string;
	status?: keyof typeof StatusCardReq;
	to?: string;
	type?: keyof typeof TypeCardReq;
}

export type IResidentCardReqResponse = BaseResponeList<IResidentCardReq>;
export type IResidentCardReqDetail = BaseResponeDetail<IResidentCardReq>;
