import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import { Option } from 'components/form/PullDown';
import { PullDown } from 'components/pulldown';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { deleteUtils, getUtils } from 'services/utils';
import { getUtilsGroup } from 'services/utils/group';
import { IUtils } from 'services/utils/type';
import { PermistionAction } from 'variables/permission';

const COLUMNS: Array<IColumn<IUtils>> = [
	{ key: 'name', label: 'Tên tiện ích' },
	{ key: 'facilityGroupId', label: 'Loại tiện ích' },
	{ key: 'areaId', label: 'Phân khu' },
	{ key: 'address', label: 'Địa chỉ' },
	{ key: 'maxOrderNumber', label: 'Sức chứa' },
	{ key: 'depositAmount', label: 'Yêu cầu đặt cọc', cell: ({ depositAmount }) => (depositAmount ? 'Có' : 'Không') },
	{ key: 'depositAmount', label: 'Số tiền đặc cọc' },
	{
		key: 'timeSlots',
		label: 'Giờ hoạt động',
		cell: ({ timeSlots }) => timeSlots?.map(i => `${i?.start} - ${i?.end}`).join(', '),
	},
	{
		key: 'isAllowBookViaApp',
		label: 'Cho phép đặt chỗ qua App',
		cell: ({ isAllowBookViaApp }) => (isAllowBookViaApp ? 'Có' : 'Không'),
	},
	{ key: 'state', label: 'Trạng thái' },
];

const UtilitiesManagement: React.FC = () => {
	const { toast } = useToastInstance();
	const [currentPage, setCurrentPage] = useState(0);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);
	const keywordRef = useRef<HTMLInputElement>(null);
	const [param, setParams] = useState<{
		name?: string;
		facilityGroupId?: string;
		areaId?: string;
	}>({});
	const [keywordGroup, setKeywordGroup] = useState('');
	const [keywordArea, setKeywordArea] = useState('');
	const [selectedGroup, setGroup] = useState<Option>();

	const keywordGroupDebound = useDebounce(keywordGroup, 500);
	const keywordAreaDebound = useDebounce(keywordArea, 500);
	const [selectedArea, setArea] = useState<Option>();

	const { data: dataGroup } = useQuery(['listGroup', keywordGroupDebound], () => getUtilsGroup(keywordGroupDebound));
	const { data, isLoading, refetch } = useQuery(['listUtils', param, currentPage, currentPageSize], () =>
		getUtils({ ...param, page: currentPage, size: currentPageSize }),
	);
	const { data: dataArea } = useQuery(['listArea', keywordAreaDebound], () => getArea({ name: keywordAreaDebound }));
	const mutationDelete = useMutation(deleteUtils);

	const handleApllyFilter = () => {
		setParams(prev => ({
			...prev,
			name: keywordRef.current?.value || '',
			...(selectedGroup ? { facilityGroupId: selectedGroup.value as string } : {}),
			...(selectedArea ? { areaId: selectedArea.value as string } : {}),
		}));
	};

	const handleDelete = async (row: { id: string; name: string }) => {
		try {
			await alert({
				type: 'error',
				title: 'Bạn có muốn xoá ?',
				description: row.name,
			});
			await mutationDelete.mutateAsync(row.id);
			toast({ title: 'Xoá thành công' });
			refetch();
		} catch {
			toast({ title: 'Xoá thất bại', status: 'error' });
		}
	};

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? data?.pageNum < data?.totalPages : false,
		hasPreviousPage: data ? data?.pageNum < 0 : false,
	};

	const { changeAction } = useActionPage();

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
								options={dataGroup?.items.map(i => ({ label: i.name, value: i.id })) || []}
								onChange={value => setGroup(value)}
								onInputChange={setKeywordGroup}
							/>
						</FormControl>
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên tiện ích</Text>
							</FormLabel>
							<Input
								ref={keywordRef}
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
								options={dataArea?.items.map(i => ({ label: i.name, value: i.id })) || []}
								onChange={setArea}
								isSearchable={false}
								onInputChange={setKeywordArea}
							/>
						</FormControl>
					</Stack>
					<Flex mt={3} justify="end">
						<Button variant="lightBrand" onClick={handleApllyFilter} leftIcon={<SearchIcon />}>
							Tìm kiếm
						</Button>
						<Button marginLeft={1} variant="brand" onClick={() => changeAction('create')} leftIcon={<MdLibraryAdd />}>
							Thêm mới
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
					minWith="1500px"
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
					action={[PermistionAction.UPDATE, PermistionAction.DELETE, PermistionAction.VIEW]}
					onClickDetail={row => changeAction('detail', row.id)}
					onClickEdit={row => changeAction('edit', row.id)}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={handleDelete}
				/>
			</Card>
		</Box>
	);
};

export default UtilitiesManagement;
