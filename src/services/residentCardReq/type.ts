import { BaseOption, Option } from 'components/form/PullDown';
import { BaseParams, BaseResponeList } from 'services/type';
import { Status } from 'variables/status';

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
		tag: 'orange',
	},
	{
		label: 'Đã duyệt',
		value: 'ACCEPTED',
		tag: 'linkedin',
	},
	{
		label: 'Từ chối',
		value: 'REJECTED',
		tag: 'red',
	},
	{
		label: 'Đã huỷ',
		value: 'CANCEL',
		tag: 'red',
	},
];

export const typeCardReq: Array<BaseOption<keyof typeof TypeCardReq>> = [
	{
		label: 'Tạo mới thẻ',
		value: 'CREATE_NEW',
		tag: 'blue',
	},
	{
		label: 'Cấp lại thẻ',
		value: 'RE_NEW',
		tag: 'orange',
	},
	{
		label: 'Mở thẻ',
		value: 'ACTIVE',
		tag: 'cyan',
	},
	{
		label: 'Khoá thẻ',
		value: 'INACTIVE',
		tag: 'red',
	},
	{
		label: 'Huỷ thẻ',
		value: 'CANCEL',
		tag: 'red',
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
