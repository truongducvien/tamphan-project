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
import { useLoadMore } from 'hooks/useLoadMore';
import { MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { deleteUtils, getUtils } from 'services/utils';
import { getUtilsGroup } from 'services/utils/group';
import { IUtilsGroup, IUtilsGroupParams } from 'services/utils/group/type';
import { IUtils } from 'services/utils/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';

const COLUMNS: Array<IColumn<IUtils>> = [
	{ key: 'name', label: 'Tên tiện ích' },
	{ key: 'facilityGroupName', label: 'Loại tiện ích' },
	{ key: 'areaName', label: 'Phân khu' },
	{ key: 'address', label: 'Địa chỉ' },
	{ key: 'maxOrderNumber', label: 'Sức chứa' },
	{ key: 'depositAmount', label: 'Yêu cầu đặt cọc', cell: ({ depositAmount }) => (depositAmount ? 'Có' : 'Không') },
	{ key: 'depositAmount', label: 'Số tiền đặt cọc' },
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
	{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
];

const UtilitiesManagement: React.FC = () => {
	const { toast } = useToastInstance();
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
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

	const { data, isLoading, refetch } = useQuery(['listUtils', param, currentPage, currentPageSize], () =>
		getUtils({ ...param, page: currentPage - 1, size: currentPageSize }),
	);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { name: keywordAreaDebound },
	});

	const {
		data: dataGroup,
		isLoading: isLoadingGroup,
		fetchMore: fetchMoreGroup,
	} = useLoadMore<IUtilsGroup, IUtilsGroupParams>({
		id: ['listGroup', keywordGroupDebound],
		func: getUtilsGroup,
		payload: { name: keywordGroupDebound },
	});

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
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
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
								options={dataGroup.map(i => ({ label: i.name, value: i.id })) || []}
								onChange={value => setGroup(value)}
								onInputChange={setKeywordGroup}
								isLoading={isLoadingGroup}
								onLoadMore={fetchMoreGroup}
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
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
								onChange={setArea}
								isSearchable={false}
								isLoading={isLoadingArea}
								onInputChange={setKeywordArea}
								onLoadMore={fetchMoreArea}
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
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWith="2000px"
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
						onPageSizeChange: pageSize => {
							setCurrentPage(1);
							setCurrentPageSize(pageSize);
						},
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
