import { useEffect, useMemo, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { DataTable, IColumn } from 'components/table';
import { PermistionAction } from 'variables/permission';

export interface User extends DataTable {
	id: number;
	acount: string;
	fullName: string;
	email?: string;
	phone?: string;
	role?: string;
	room?: string;
	status?: string;
	subdivision?: { id: string; name: string };
}

const users: Array<User> = [
	{
		id: 1,
		acount: 'admin@novaid.vn',
		fullName: 'addmin',
		email: 'admin@novaid.vn',
		phone: '1234561234',
		role: 'ban quản lí',
		room: '',
		status: 'Đang hoạt động',
		subdivision: {
			id: '1',
			name: 'Rever park 1',
		},
	},
	{
		id: 2,
		acount: 'admin@novaid.vn',
		fullName: 'addmin',
		email: 'admin@novaid.vn',
		phone: '1234561234',
		role: 'ban quản lí',
		room: '',
		status: 'Đang hoạt động',
		subdivision: {
			id: '1',
			name: 'Rever park 2',
		},
	},
];

const UserManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<User>> = [
		{ key: 'acount', label: 'Tài khoản' },
		{ key: 'fullName', label: 'Họ tên' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Sô điện thoại' },
		{ key: 'role', label: 'Vai trò người dùng' },
		{ key: 'room', label: 'đơn vị' },
		{
			key: 'subdivision',
			label: 'Phân khu',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ subdivision }) => <Text>{subdivision?.name}</Text>,
		},
		{ key: 'status', label: 'Trạng thái' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...users, ...users, ...users]}
					pagination={{
						total: Number(pageInfo?.total || 0),
						pageSize: currentPageSize,
						value: currentPage,
						hasNextPage: pageInfo?.hasNextPage,
						hasPreviousPage: pageInfo?.hasPreviousPage,
						onPageChange: page => setCurrentPage(page),
						onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					}}
					action={[PermistionAction.EDIT, PermistionAction.DETETE]}
				/>
			</Card>
		</Box>
	);
};

export default UserManagement;
