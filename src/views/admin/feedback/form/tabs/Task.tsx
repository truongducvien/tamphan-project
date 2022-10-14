import { Box, Center, Heading, Text } from '@chakra-ui/react';
import Table, { IColumn } from 'src/components/table';
import { feedbackStatusOption } from 'src/services/feedback/type';
import { PermistionAction } from 'src/variables/permission';

const dummyData = [
	{
		id: '1',
		createBy: 'Nguyen Van A',
		receptBy: 'Tran Thanh',
		expizeDate: '2020-11-02',
		content: 'Kiểm tra điện',
		completedDate: '2020-11-02',
		status: feedbackStatusOption[1].value,
	},
	{
		id: '2',
		createBy: 'Nguyen Van A',
		receptBy: 'Tran Thanh',
		expizeDate: '2020-11-02',
		content: 'Kiểm tra điện',
		completedDate: '2020-11-02',
		status: feedbackStatusOption[1].value,
	},
];

export const TaskTab: React.FC = () => {
	const COLUMNS: Array<IColumn<typeof dummyData[0]>> = [
		{ key: 'id', label: 'ID' },
		{ key: 'createBy', label: 'Người tạo' },
		{ key: 'receptBy', label: 'Người nhận' },
		{ key: 'expizeDate', label: 'Hết hạn', dateFormat: 'DD/MM/YYYY' },
		{
			key: 'content',
			label: 'Nội dung',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ content }) => (
				<Text fontWeight={700} maxH={50} textOverflow="ellipsis">
					{content}
				</Text>
			),
		},
		{ key: 'completedDate', label: 'Hoàn thành', dateFormat: 'DD/MM/YYYY' },
		{ key: 'status', label: 'Trạng thái', tag: ({ status }) => feedbackStatusOption.find(i => i.value === status) },
	];

	return (
		<Box pt="10px">
			<Center mb={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh sách công việc
				</Heading>
			</Center>
			<Table
				loading={false}
				testId="consignments-dashboard"
				columns={COLUMNS}
				data={dummyData}
				action={PermistionAction.VIEW}
			/>
		</Box>
	);
};
