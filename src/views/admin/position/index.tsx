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
	HStack,
	Input,
	Link,
	Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { DataTable, IColumn } from 'components/table';
import { MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

export interface Position extends DataTable {
	name: string;
	code: string;
	updateAt: string;
	createAt?: string;
}

const position: Array<Position> = [
	{
		id: 1,
		name: 'addmin',
		code: '2',
		updateAt: '11/11/2022',
		createAt: '11/11/2022',
	},
	{
		id: 2,
		name: 'addmin',
		code: '2',
		updateAt: '11/11/2022',
		createAt: '11/11/2022',
	},
];

const PositionManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Position>> = [
		{ key: 'name', label: 'Tên chức vụ' },
		{ key: 'code', label: 'Mã chức vụ' },
		{ key: 'createAt', label: 'Ngày tạo' },
		{ key: 'updateAt', label: 'Ngày cập nhật' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<HStack spacing={5} px={{ sm: 2, md: 5 }} alignItems="flex-end">
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
							<Text>Tên chức vụ</Text>
						</FormLabel>
						<Input
							variant="admin"
							fontSize="sm"
							ms={{ base: '0px', md: '0px' }}
							type="text"
							placeholder="Nhập chức vụ"
							size="md"
						/>
					</FormControl>
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
							<Text>Mã chức vụ</Text>
						</FormLabel>
						<Input
							variant="admin"
							fontSize="sm"
							ms={{ base: '0px', md: '0px' }}
							type="text"
							placeholder="Nhập mã chức vụ"
							size="md"
						/>
					</FormControl>
					<Flex align="center">
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Link to={`${patchs.Position}/${patchs.Create}`} as={RouterLink}>
							<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Link>
					</Flex>
				</HStack>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách chức vụ
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...position, ...position, ...position]}
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

export default PositionManagement;
