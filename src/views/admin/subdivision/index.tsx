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
	id: number;
	name: string;
	type: string;
	area?: string;
	phone?: string;
	position?: string;
	enail?: string;
}

const subdivision: Array<Subdivision> = [
	{
		id: 1,
		enail: 'admin@novaid.vn',
		name: 'demo',
		email: 'admin@novaid.vn',
		phone: '1234561234',
		area: '12ha',
		position: 'Phía Tây',
		type: 'BDS',
	},
	{
		id: 2,
		enail: 'admin@novaid.vn',
		name: 'demo',
		email: 'admin@novaid.vn',
		phone: '1234561234',
		area: '12ha',
		position: 'Phía Tây',
		type: 'BDS',
	},
];

const SubdivisionManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Subdivision>> = [
		{ key: 'name', label: 'Tên phân khu' },
		{ key: 'type', label: 'Loại hình BDS' },
		{ key: 'area', label: 'Diện tích' },
		{ key: 'position', label: 'Vị trí' },
		{ key: 'phone', label: 'Số điện thoại' },
		{ key: 'email', label: 'email' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<HStack px={{ sm: 2, md: 5 }} spacing={5} align="end">
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
							<Text>Tên phân khu</Text>
						</FormLabel>
						<Input
							isRequired
							variant="admin"
							fontSize="sm"
							maxW={300}
							ms={{ base: '0px', md: '0px' }}
							type="email"
							placeholder="Nhập ..."
							size="md"
						/>
					</FormControl>
					<Flex align="center">
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Link to={`${patchs.Subdivision}/${patchs.Create}`} as={RouterLink}>
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
						Danh sách phân khu
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

export default SubdivisionManagement;
