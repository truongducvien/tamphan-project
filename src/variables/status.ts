import { Option } from 'src/components/form/PullDown';

export enum Status {
	INIT = 'INIT',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export const statusOption1: Array<Option> = [
	{
		label: 'Khởi tạo',
		value: Status.INIT,
		colorScheme: 'gray',
	},
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
		colorScheme: 'cyan',
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
		colorScheme: 'red',
	},
];

export const statusOption2: Array<Option> = [
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
		colorScheme: 'cyan',
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
		colorScheme: 'red',
	},
];
