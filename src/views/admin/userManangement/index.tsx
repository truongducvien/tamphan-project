import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Select,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { DataTable, IColumn } from 'components/table';
import { MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
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
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={5}>
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Đơn vị</Text>
							</FormLabel>
							<Select
								data-testid="page-size-dropdown"
								size="md"
								ml={1}
								variant="admin"
								_hover={{ bg: 'made.80' }}
								placeholder="Chọn đơn vị"
							/>
						</FormControl>
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Họ tên</Text>
							</FormLabel>
							<Input
								isRequired
								variant="admin"
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="email"
								placeholder="Nhập họ tên"
								size="md"
							/>
						</FormControl>
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tài khoản</Text>
							</FormLabel>
							<Input
								isRequired
								variant="admin"
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="email"
								placeholder="Nhập tài khoản"
								mb="24px"
								fontWeight="500"
								size="md"
							/>
						</FormControl>
					</SimpleGrid>
					<Flex flex={1} alignItems="flex-end" justifyContent="flex-end">
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Link to={`${patchs.User}/${patchs.Create}`} as={RouterLink}>
							<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Link>
					</Flex>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách người dùng
					</Heading>
				</Center>
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
