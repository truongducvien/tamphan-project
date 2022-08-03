import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { DataTable, IColumn } from 'components/table';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

export interface Resident extends DataTable {
	name: string;
	description: string;
	image: string;
	status: string;
	createAt: string;
}

const apartment: Array<Resident> = [
	{
		name: 'string ',
		description: 'string',
		image: 'string',
		status: 'string',
		createAt: 'string',
	},
];

const TypeUtilitiesManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Resident>> = [
		{ key: 'name', label: 'Tên loại tiện ích' },
		{ key: 'description', label: 'Mô tả' },
		{ key: 'image', label: 'hình ảnh' },
		{ key: 'status', label: 'Trạng thái hoạt động' },
		{ key: 'createAt', label: 'Ngày cập nhật' },
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
						<FormControl flex={0.5}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên loại tiện ích</Text>
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
						<Flex flex={1} justifyContent="end">
							<Button variant="lightBrand" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Link to={`${patchs.TypeUtilities}/${patchs.Create}`} as={RouterLink}>
								<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
									Thêm mới
								</Button>
							</Link>
							<Button marginLeft={1} variant="delete" leftIcon={<MdDelete />}>
								Xoá
							</Button>
						</Flex>
					</Stack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách cư dân
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

export default TypeUtilitiesManagement;
