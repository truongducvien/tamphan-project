import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { currency } from 'src/helpers/currency';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { deleteFacility, getFacility } from 'src/services/facility';
import { getFacilityGroup } from 'src/services/facility/group';
import { IFacilityGroup, IFacilityGroupParams } from 'src/services/facility/group/type';
import { IFacility } from 'src/services/facility/type';
import { statusOption2 } from 'src/variables/status';

const COLUMNS: Array<IColumn<IFacility>> = [
	{ key: 'name', label: 'Tên tiện ích' },
	{ key: 'facilityGroupName', label: 'Loại tiện ích' },
	{ key: 'areaName', label: 'Phân khu' },
	{ key: 'address', label: 'Địa chỉ' },
	{ key: 'maxOrderNumber', label: 'Sức chứa' },
	{
		key: 'depositAmount',
		label: 'Yêu cầu đặt cọc',
		cell: ({ depositAmount }) => (depositAmount.amount ? 'Có' : 'Không'),
	},
	{
		key: 'depositAmount',
		label: 'Số tiền đặt cọc',
		cell: ({ depositAmount }) => (depositAmount.amount ? currency(depositAmount.amount, depositAmount.currency) : '-'),
	},
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

interface DataForm {
	areaId: BaseOption<string>;
	name?: string;
	facilityGroupId?: BaseOption<string>;
}

const FacilityManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { toast } = useToastInstance();
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [param, setParams] = useState<{
		name?: string;
		facilityGroupId?: string;
		areaId?: string;
	}>({});
	const [keywordGroup, setKeywordGroup] = useState('');
	const [keywordArea, setKeywordArea] = useState('');

	const keywordGroupDebound = useDebounce(keywordGroup, 500);
	const keywordAreaDebound = useDebounce(keywordArea, 500);

	const { data, isLoading, refetch } = useQuery(['listFacility', param, currentPage, currentPageSize], () =>
		getFacility({ ...param, page: currentPage - 1, size: currentPageSize }),
	);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { code: keywordAreaDebound },
	});

	const {
		data: dataGroup,
		isLoading: isLoadingGroup,
		fetchMore: fetchMoreGroup,
	} = useLoadMore<IFacilityGroup, IFacilityGroupParams>({
		id: ['listGroup', keywordGroupDebound],
		func: getFacilityGroup,
		payload: { name: keywordGroupDebound },
	});

	const mutationDelete = useMutation(deleteFacility);

	const handleApllyFilter = (payload: DataForm) => {
		setParams({
			...payload,
			areaId: payload.areaId?.value,
			facilityGroupId: payload.facilityGroupId?.value,
		});
	};

	const handleDelete = async (row: { id: string; name: string }) => {
		try {
			const next = await alert({
				type: 'error',
				title: 'Bạn có muốn xoá ?',
				description: row.name,
			});
			if (!next) return;
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
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<FormContainer onSubmit={handleApllyFilter}>
					<Box px={{ sm: 2, md: 5 }}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'left', xl: 'left' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<PullDownHookForm
								label="Loại tiện ích"
								name="facilityGroupId"
								options={dataGroup.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordGroup}
								isLoading={isLoadingGroup}
								onLoadMore={fetchMoreGroup}
								isClearable
							/>

							<TextFieldHookForm variant="admin" label="Tên tiện ích" name="name" />
							<PullDownHookForm
								label="Phân khu"
								name="areaId"
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
								isSearchable={false}
								isLoading={isLoadingArea}
								onInputChange={setKeywordArea}
								onLoadMore={fetchMoreArea}
								isClearable
							/>
						</Stack>
						<Flex mt={3} justify="end">
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button
								hidden={!permistionAction.ADD}
								marginLeft={1}
								variant="brand"
								onClick={() => changeAction('create')}
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</Box>
				</FormContainer>
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
					action={actions}
					onClickDetail={row => changeAction('detail', row.id)}
					onClickEdit={row => changeAction('edit', row.id)}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={handleDelete}
				/>
			</Card>
		</Box>
	);
};

export default FacilityManagement;
