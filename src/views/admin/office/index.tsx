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

export interface Subdivision extends DataTable {
	name: string;
	parrent: string;
	description: string;
	createAt?: string;
}

const subdivision: Array<Subdivision> = [
	{
		id: 1,
		name: 'addmin',
		parrent: '2',
		description: '1234561234',
		createAt: 'ban quản lí',
	},
	{
		id: 2,
		name: 'addmin',
		parrent: '2',
		description: '1234561234',
		createAt: 'ban quản lí',
	},
];

const OfficeManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Subdivision>> = [
		{ key: 'name', label: 'Tên đơn vị' },
		{ key: 'parrent', label: 'Đơn vị trực thuộc' },
		{ key: 'description', label: 'Mô tả' },
		{ key: 'createAt', label: 'Ngày tạo' },
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
					<HStack spacing={5} align="flex-end">
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên đơn vị</Text>
							</FormLabel>
							<Input
								variant="admin"
								maxW={500}
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="email"
								placeholder="Nhập đơn vị"
								size="md"
							/>
						</FormControl>
						<Flex>
							<Button variant="lightBrand" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Link to={`${patchs.Office}/${patchs.Create}`} as={RouterLink}>
								<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
									Thêm mới
								</Button>
							</Link>
						</Flex>
					</HStack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách Đơn vị
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...subdivision, ...subdivision, ...subdivision]}
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

export default OfficeManagement;
