import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import Card from 'src/components/card/Card';
import Table, { IColumn } from 'src/components/table';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { getArea } from 'src/services/area';
import { IArea } from 'src/services/area/type';
import { PermistionAction } from 'src/variables/permission';

const AreaManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');
	const { data, isLoading } = useQuery(
		['listArea', keyword, currentPage, pageSize],
		() =>
			getArea({
				page: currentPage - 1,
				size: pageSize,
				code: keyword,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);
	const { changeAction } = useActionPage();

	const COLUMNS: Array<IColumn<IArea>> = [
		{ key: 'name', label: 'Tên phân khu' },
		{ key: 'code', label: 'Mã phân khu' },
		{ key: 'acreage', label: 'Diện tích (ha)' },
		{ key: 'location', label: 'Vị trí' },
		{ key: 'contactPhone', label: 'Số điện thoại' },
		{ key: 'contactEmail', label: 'email' },
	];

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<HStack px={{ sm: 2, md: 5 }} spacing={5} align="end">
					<FormControl>
						<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
							<Text>Mã phân khu</Text>
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
							onClick={() => {
								setKeyword(keywordRef.current?.value || '');
								resetPage();
							}}
							leftIcon={<SearchIcon />}
						>
							Tìm kiếm
						</Button>
						<Button
							marginLeft={1}
							hidden={!permistionAction.ADD}
							onClick={() => changeAction('create')}
							variant="brand"
							leftIcon={<MdLibraryAdd />}
						>
							Thêm mới
						</Button>
					</Flex>
				</HStack>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách phân khu
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWidth={1200}
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default AreaManagement;
