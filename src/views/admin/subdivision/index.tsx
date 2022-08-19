import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { IArea, typeAreas } from 'services/area/type';
import { PermistionAction } from 'variables/permission';

const SubdivisionManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const keywordRef = useRef<HTMLInputElement>(null);

	const [keyword, setKeyword] = useState('');
	const { data, isLoading } = useQuery(['list', keyword, currentPage, currentPageSize], () =>
		getArea({
			page: currentPage,
			size: currentPageSize,
			name: keyword,
		}),
	);
	const { changeAction } = useActionPage();

	const COLUMNS: Array<IColumn<IArea>> = [
		{ key: 'name', label: 'Tên phân khu' },
		{ key: 'code', label: 'Mã phân khu' },
		{ key: 'type', label: 'Loại hình BDS', cell: ({ type }) => typeAreas.find(i => i.value === type)?.label },
		{ key: 'acreage', label: 'Diện tích' },
		{ key: 'location', label: 'Vị trí' },
		{ key: 'contactPhone', label: 'Số điện thoại' },
		{ key: 'contactEmail', label: 'email' },
	];

	const pageInfo = {
		total: data?.totalItems,
		hasNextPage: data ? data?.pageNum < data?.totalPages : false,
		hasPreviousPage: data ? data?.pageNum < 0 : false,
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
							ref={keywordRef}
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
						<Button
							variant="lightBrand"
							onClick={() => setKeyword(keywordRef.current?.value || '')}
							leftIcon={<SearchIcon />}
						>
							Tìm kiếm
						</Button>
						<Button marginLeft={1} onClick={() => changeAction('create')} variant="brand" leftIcon={<MdLibraryAdd />}>
							Thêm mới
						</Button>
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
					keyField="name"
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{
						total: Number(pageInfo?.total || 0),
						pageSize: currentPageSize,
						value: currentPage,
						hasNextPage: pageInfo?.hasNextPage,
						hasPreviousPage: pageInfo?.hasPreviousPage,
						onPageChange: page => setCurrentPage(page),
						onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					}}
					action={[PermistionAction.UPDATE, PermistionAction.VIEW]}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default SubdivisionManagement;
