import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { getResident } from 'services/resident';
import { gender as genderOptions, IResident, IResidentParams, residentType } from 'services/resident/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validation = Yup.object({
	areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const ResidentManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const COLUMNS: Array<IColumn<IResident>> = [
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp' },
		{ key: 'identityLocationIssued', label: 'Nới cấp' },
		{ key: 'propertyName', label: 'Căn hộ' },
		{ key: 'type', label: 'Vai trò', cell: ({ type }) => residentType.find(i => i.value === type)?.label },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', cell: ({ state }) => statusOption2.find(i => i.value === state)?.label },
	];

	const [params, setParams] = useState<IResidentParams>();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const { data: dataArea } = useQuery(['listArea', keyword], () => getArea({ name: keywordDebounce }));

	const { data, isLoading } = useQuery(['listResident', params, currentPage, currentPageSize], () =>
		getResident({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const onSearch = (payload: IResidentParams) => {
		setParams(payload);
	};

	const pageInfo = {
		total: data?.totalItems,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
							<PullDowndHookForm
								name="areaId"
								label="Phân khu"
								options={
									dataArea?.items.map(i => ({
										label: i.name,
										value: i.id,
									})) || []
								}
								onInputChange={setKeyword}
								isClearable
							/>
							<TextFieldHookForm label="Tên cư dân" name="fullName" />
						</Stack>
						<Flex mt="3" justifyContent="end">
							<Button type="submit" variant="lightBrand" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button marginLeft={1} variant="light" leftIcon={<MdImportExport />}>
								Import
							</Button>
							<Button marginLeft={1} onClick={() => changeAction('create')} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách cư dân
					</Heading>
				</Center>
				<Table
					minWith="2000px"
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
					onClickDetail={({ id, propertyId }) => changeAction('detail', `${id},${propertyId}`)}
					onClickEdit={({ id, propertyId }) => changeAction('edit', `${id},${propertyId}`)}
				/>
			</Card>
		</Box>
	);
};

export default ResidentManagement;
