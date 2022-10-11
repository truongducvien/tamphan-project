import React from 'react';

import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { BaseOption } from 'src/components/form/PullDown';
import Table, { IColumn } from 'src/components/table';

enum Status {
	DONE,
	ADD,
	RECIVE,
}
const StatusOption: Array<BaseOption<Status>> = [
	{
		label: 'Hoàn thành',
		value: 0,
		colorScheme: 'cyan',
	},
	{
		label: 'Thêm công việc',
		value: 1,
		colorScheme: 'orange',
	},
	{
		label: 'Tiếp nhận',
		value: 2,
		colorScheme: 'facebook',
	},
];

const dummyData = [
	{
		id: '1',
		status: Status.DONE,
		by: 'Nguyen Van A',
		time: '2020-11-01',
		note: 'note',
	},
	{
		id: '2',
		status: Status.ADD,
		by: 'Nguyen Van A',
		time: '2020-11-01',
		note: 'note',
	},
];

const HistoryTab: React.FC = () => {
	const COLUMNS: Array<IColumn<typeof dummyData[0]>> = [
		{ key: 'status', label: 'Thao tác', tag: ({ status }) => StatusOption.find(i => i.value === status) },
		{ key: 'by', label: 'Người thao tác' },
		{ key: 'time', label: 'Thời gian thao tác', dateFormat: 'DD/MM/YYYY' },
		{
			key: 'note',
			label: 'Nội dung',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ note }) => (
				<Text fontWeight={700} maxH={50} textOverflow="ellipsis">
					{note}
				</Text>
			),
		},
	];
	return (
		<Box pt="10px">
			<Center mb={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh sách công việc
				</Heading>
			</Center>
			<Table loading={false} testId="consignments-dashboard" columns={COLUMNS} data={dummyData} />
		</Box>
	);
};

export default HistoryTab;
