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
	},
	{
		label: 'Đã duyệt',
		value: 'ACCEPTED',
	},
	{
		label: 'Từ chối',
		value: 'REJECTED',
	},
	{
		label: 'Đã huỷ',
		value: 'CANCEL',
	},
];

export const typeCardReq: Array<BaseOption<keyof typeof TypeCardReq>> = [
	{
		label: 'Tạo mới thẻ',
		value: 'CREATE_NEW',
	},
	{
		label: 'Cấp lại thẻ ',
		value: 'RE_NEW',
	},
	{
		label: 'Mở thẻ',
		value: 'ACTIVE',
	},
	{
		label: 'Khoá thẻ',
		value: 'INACTIVE',
	},
	{
		label: 'Huỷ thẻ',
		value: 'CANCEL',
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
