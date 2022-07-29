import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, FormControl, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { PullDown } from 'components/pulldown';
import Table, { DataTable, IColumn } from 'components/table';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { patchs } from 'variables/patch';
import { PermistionAction } from 'variables/permission';

export interface Resident extends DataTable {
	name: string;
	birthday: string;
	gender: string;
	cmnd: string;
	createCm: string;
	addCm: string;
	partmentCode: string;
	role: string;
	email: string;
	phone: string;
	address: string;
	currentAddress: string;
	status: string;
}

const apartment: Array<Resident> = [
	{
		name: 'string ',
		birthday: 'string',
		gender: 'string',
		cmnd: 'string',
		createCm: 'string',
		addCm: 'string',
		partmentCode: 'string',
		role: 'string',
		email: 'string',
		phone: 'string',
		address: 'string',
		currentAddress: 'string',
		status: 'string',
	},
];

const ResidentManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<Resident>> = [
		{ key: 'name', label: 'Tên cư dân' },
		{ key: 'birthday', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính' },
		{ key: 'cmnd', label: 'CMND/ CCCD/ HC' },
		{ key: 'createCm', label: 'Ngày cấp' },
		{ key: 'addCm', label: 'Nới cấp' },
		{ key: 'partmentCode', label: 'Căn hộ' },
		{ key: 'role', label: 'Vai trò' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Số điện thoại' },
		{ key: 'address', label: 'Địa chỉ thường trú' },
		{ key: 'currentAddress', label: 'Địa chỉ tạm trú' },
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
				<Box p={{ sm: 2, md: 5 }} mt={2}>
					<Stack
						spacing={5}
						align="end"
						justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
						direction={{ base: 'column', md: 'row' }}
					>
						<FormControl flex={1}>
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
						<FormControl flex={1}>
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
						<FormControl flex={1}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên cư dân</Text>
							</FormLabel>
							<Input variant="admin" />
						</FormControl>
					</Stack>
					<Box mt="3">
						<Button variant="lightBrand" leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Button marginLeft={1} variant="light" leftIcon={<MdImportExport />}>
							Import
						</Button>
						<Link to={`${patchs.Resident}/${patchs.Create}`} as={RouterLink}>
							<Button marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Link>
					</Box>
				</Box>
				<Center m={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách cư dân
					</Heading>
				</Center>
				<Table
					minWith="2000px"
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

export default ResidentManagement;
