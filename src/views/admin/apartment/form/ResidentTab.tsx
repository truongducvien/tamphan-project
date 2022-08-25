import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { BaseOption, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { getResident } from 'services/resident';
import { gender as genderOptions, IResident, IResidentParams, residentType } from 'services/resident/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

export const ResidentTab: React.FC<{ id: string }> = ({ id: idApartment }) => {
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
		payload: { name: keywordDebounce },
	});

	const { data, isLoading } = useQuery(['listResident', params, currentPage, currentPageSize], () =>
		getResident({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const { changeAction } = useActionPage();

	return (
		<Box>
			<Flex justifyContent="end">
				<Button marginLeft={1} onClick={() => {}} variant="brand" leftIcon={<MdLibraryAdd />}>
					Thêm mới
				</Button>
			</Flex>
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
					onPageSizeChange: pageSize => {
						setCurrentPage(1);
						setCurrentPageSize(pageSize);
					},
				}}
				action={[PermistionAction.DELETE]}
			/>
		</Box>
	);
};
