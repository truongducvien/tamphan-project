export enum Status {
	INIT = 'INIT',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export const statusOption1: Array<{
	label: string;
	value: string;
}> = [
	{
		label: 'Khởi tạo',
		value: Status.INIT,
	},
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
	},
];

export const statusOption2: Array<{
	label: string;
	value: string;
}> = [
	{
		label: 'Đang hoạt động',
		value: Status.ACTIVE,
	},
	{
		label: 'Ngưng hoạt động',
		value: Status.INACTIVE,
	},
];
