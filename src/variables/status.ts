import { Option } from 'components/form/PullDown';

export enum Status {
	INIT = 'INIT',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export const statusOption1: Array<Option> = [
	{
		label: 'Khởi tạo',
		value: Status.INIT,
		tag: 'gray',
	},
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
		tag: 'cyan',
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
		tag: 'red',
	},
];

export const statusOption2: Array<Option> = [
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
		tag: 'cyan',
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
		tag: 'red',
	},
];
