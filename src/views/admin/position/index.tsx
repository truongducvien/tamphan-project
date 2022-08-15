import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { MdLibraryAdd } from 'react-icons/md';
import { IRole } from 'services/role/type';
import { PermistionAction } from 'variables/permission';

const PositionManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const nameRef = useRef<HTMLInputElement>(null);
	const codeRef = useRef<HTMLInputElement>(null);

	const [param, setParams] = useState<{
		name?: string;
		amenitiesGroupId?: string;
		areaId?: string;
	}>({});

	const COLUMNS: Array<IColumn<IRole>> = [
		{ key: 'name', label: 'Tên chức vụ' },
		{ key: 'code', label: 'Mã chức vụ' },
		{ key: 'createdDate', label: 'Ngày tạo' },
		{ key: 'updatedDate', label: 'Ngày cập nhật' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};
	const { changeAction } = useActionPage();

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
						<Button onClick={() => changeAction('create')} marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
							Thêm mới
						</Button>
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
					data={[]}
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
