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
	Select,
	Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { PullDown } from 'components/pulldown';
import Table, { DataTable, IColumn } from 'components/table';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

export interface Apartment extends DataTable {
	code: string;
	name: string;
	type: string;
	tang: string;
	khoi: string;
	status: string;
	area: string;
	countBed: string;
	countRoom: string;
	countTang: string;
	subdivision: string;
	chu: string;
	CMND: string;
}

const apartment: Array<Apartment> = [
	{
		code: 'string',
		name: 'string',
		type: 'string',
		tang: 'string',
		khoi: 'string',
		status: 'string',
		area: 'string',
		countBed: 'string',
		countRoom: 'string',
		countTang: 'string',
		subdivision: 'string',
		chu: 'string',
		CMND: 'string',
	},
];

const ApartMentManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Apartment>> = [
		{ key: 'code', label: 'Mã căn hộ' },
		{ key: 'name', label: 'Tên đơn vị' },
		{ key: 'type', label: 'Loại căn hộ' },
		{ key: 'tang', label: 'Tầng' },
		{ key: 'khoi', label: 'Khối' },
		{ key: 'status', label: 'Trạng thái' },
		{ key: 'area', label: 'Diện tích' },
		{ key: 'countBed', label: 'Sô phòng ngủ' },
		{ key: 'countRoom', label: 'Số phòng tắm' },
		{ key: 'countTang', label: 'Số Tầng' },
		{ key: 'subdivision', label: 'Phân khu' },
		{ key: 'chu', label: 'Chủ sở hữu' },
		{ key: 'CMND', label: 'CMND' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Box p={{ sm: 2, md: 5 }} mt={2}>
					<HStack spacing={5} align="end">
						<FormControl maxW={300}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Mã căn hộ</Text>
							</FormLabel>
							<Input
								variant="admin"
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="text"
								placeholder="Nhập ..."
								size="md"
							/>
						</FormControl>
						<FormControl maxW={300}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Phân khu</Text>
							</FormLabel>
							<PullDown
								name="subdivision"
								options={[
									{
										label: 'a',
										value: '1',
									},
								]}
								isMulti
								isSearchable={false}
							/>
						</FormControl>
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Button variant="light" leftIcon={<MdImportExport />}>
							Import
						</Button>
						<Link to={`${patchs.Office}/${patchs.Create}`} as={RouterLink}>
							<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Link>
					</HStack>
				</Box>
				<Center m={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách căn hộ
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...apartment, ...apartment, ...apartment]}
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

export default ApartMentManagement;
