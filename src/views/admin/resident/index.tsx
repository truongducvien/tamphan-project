import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import * as Yup from 'yup';

import Card from '@/components/card/Card';
import { FormContainer } from '@/components/form';
import { BaseOption, PullDownHookForm } from '@/components/form/PullDown';
import { TextFieldHookForm } from '@/components/form/TextField';
import Table, { IColumn } from '@/components/table';
import { BaseComponentProps } from '@/hocs/withPermission';
import useActionPage from '@/hooks/useActionPage';
import { useActionPermission } from '@/hooks/useActionPermission';
import { useDebounce } from '@/hooks/useDebounce';
import { useLoadMore } from '@/hooks/useLoadMore';
import { getArea } from '@/services/area';
import { IArea, IAreaParams } from '@/services/area/type';
import { getResident } from '@/services/resident';
import { gender as genderOptions, IResident, IResidentParams, residentType } from '@/services/resident/type';
import { PermistionAction } from '@/variables/permission';
import { statusOption2 } from '@/variables/status';

interface Form {
	areaId: BaseOption<string>;
	code: string;
	fullName: string;
}

const validation = Yup.object({
	areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const ResidentManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);

	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const COLUMNS: Array<IColumn<IResident>> = [
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh', dateFormat: 'DD/MM/YYYY' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp', dateFormat: 'DD/MM/YYYY' },
		{ key: 'identityLocationIssued', label: 'Nới cấp' },
		{ key: 'property', label: 'Mã căn hộ', cell: ({ property }) => property?.code },
		{ key: 'type', label: 'Vai trò', tag: ({ type }) => residentType.find(i => i.value === type) },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const [params, setParams] = useState<IResidentParams>();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { code: keywordDebounce },
	});

	const { data, isLoading } = useQuery(['listResident', params, currentPage, currentPageSize], () =>
		getResident({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const onSearch = (payload: Form) => {
		const prepareData = { ...payload, areaId: payload.areaId?.value };
		setParams(prepareData);
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
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} validationSchema={validation}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<TextFieldHookForm label="Mã căn hộ" name="propertyId" />
							<PullDownHookForm
								name="areaId"
								label="Phân khu"
								options={dataArea.map(i => ({
									label: i.name,
									value: i.id,
								}))}
								onInputChange={setKeyword}
								isClearable
								isLoading={isLoadingArea}
								onLoadMore={fetchMoreArea}
							/>
							<TextFieldHookForm label="Tên cư dân" name="fullName" />
						</Stack>
						<Flex mt="3" justifyContent="end">
							<Button type="submit" variant="lightBrand" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button
								hidden={!permistionAction.ADD}
								marginLeft={1}
								onClick={() => changeAction('create')}
								variant="brand"
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách cư dân
					</Heading>
				</Center>
				<Table
					minWith="2000px"
					testId="consignments-dashboard"
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
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id, property }) => changeAction('detail', `${id},${property?.id}`)}
					onClickEdit={({ id, property }) => changeAction('edit', `${id},${property?.id}`)}
				/>
			</Card>
		</Box>
	);
};

export default ResidentManagement;
