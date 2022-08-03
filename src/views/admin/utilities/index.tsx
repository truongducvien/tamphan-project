import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { PullDown } from 'components/pulldown';
import Table, { DataTable, IColumn } from 'components/table';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

export interface Untilities extends DataTable {
	name: string;
	type: string;
	subdivistion: string;
	address: string;
	max: string;
	resquest: boolean;
	price: string;
	time: string;
	apping: string;
	status: string;
}

const utils: Array<Untilities> = [
	{
		name: 'string',
		type: 'string',
		subdivistion: 'string',
		address: 'string',
		max: 'string',
		resquest: true,
		price: 'string',
		time: 'string',
		apping: 'string',
		status: 'string',
	},
];

const UtilitiesManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Untilities>> = [
		{ key: 'name', label: 'Tên tiện ích' },
		{ key: 'type', label: 'Loại tiện ích' },
		{ key: 'subdivistion', label: 'Phân khu' },
		{ key: 'address', label: 'Địa chỉ' },
		{ key: 'max', label: 'Sức chứa' },
		{ key: 'resquest', label: 'Yêu cầu đặt cọc' },
		{ key: 'price', label: 'Số tiền đặc cọc' },
		{ key: 'time', label: 'Giờ hoạt động' },
		{ key: 'apping', label: 'Cho phép đặt chỗ qua App' },
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
					<Stack
						spacing={5}
						align="end"
						justify={{ base: 'center', md: 'left', xl: 'left' }}
						direction={{ base: 'column', md: 'row' }}
					>
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								Loại tiện ích
							</FormLabel>
							<PullDown
								name="type"
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
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên tiện ích</Text>
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
						<FormControl>
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
					</Stack>
					<Flex mt={3} justify="end">
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Link to={`${patchs.Utilities}/${patchs.Create}`} as={RouterLink}>
							<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Link>
						<Button marginLeft={1} variant="delete" leftIcon={<MdDelete />}>
							Xoá
						</Button>
					</Flex>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...utils, ...utils, ...utils]}
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

export default UtilitiesManagement;
