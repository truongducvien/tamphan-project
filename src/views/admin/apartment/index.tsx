import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import { getApartment } from 'services/apartment';
import { IApartment, IApartmentParams, statusApartment } from 'services/apartment/type';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { PermistionAction } from 'variables/permission';
import * as Yup from 'yup';

interface SearchForm {
	code?: string;
	areaId?: Option;
}

const validationSchema = Yup.object({
	code: Yup.string(),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const ApartMentManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebound = useDebounce(keywordArea, 500);
	const [param, setParams] = useState<IApartmentParams | null>(null);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { name: keywordAreaDebound },
	});

	const { data, isLoading } = useQuery(['listApartment', param, currentPage, currentPageSize], () =>
		getApartment({ ...param, page: currentPage - 1, size: currentPageSize }),
	);

	const COLUMNS: Array<IColumn<IApartment>> = [
		{ key: 'code', label: 'Mã căn hộ' },
		{ key: 'name', label: 'Tên căn vị' },
		{ key: 'type', label: 'Loại căn hộ' },
		{ key: 'floorNumber', label: 'Tầng' },
		{ key: 'block', label: 'Khối' },
		{ key: 'status', label: 'Trạng thái', tag: ({ status }) => statusApartment.find(i => i.value === status) },
		{ key: 'acreage', label: 'Diện tích' },
		{ key: 'numberOfBedRoom', label: 'Sô phòng ngủ' },
		{ key: 'numberOfBathRoom', label: 'Số phòng tắm' },
		{ key: 'numberOfFloor', label: 'Số Tầng' },
		{ key: 'areaName', label: 'Phân khu' },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const onSearch = (payload: SearchForm) => {
		setParams({ ...payload, areaId: payload.areaId?.value as string });
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer validationSchema={validationSchema} onSubmit={onSearch}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<TextFieldHookForm name="code" label="Mã căn hộ" />
							<PullDowndHookForm
								name="areaId"
								label="Phân khu"
								isClearable
								onInputChange={setKeywordArea}
								isLoading={isLoadingArea}
								onLoadMore={fetchMoreArea}
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
							/>
							<Flex>
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
								<Button marginLeft={1} variant="light" leftIcon={<MdImportExport />}>
									Import
								</Button>
								<Button
									onClick={() => changeAction('create')}
									marginLeft={1}
									variant="brand"
									leftIcon={<MdLibraryAdd />}
								>
									Thêm mới
								</Button>
							</Flex>
						</Stack>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách căn hộ
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					keyField="name"
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
					action={[PermistionAction.UPDATE, PermistionAction.VIEW]}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default ApartMentManagement;
