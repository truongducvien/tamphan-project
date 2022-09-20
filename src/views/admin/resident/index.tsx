import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import importTemplate from 'src/assets/templates/resident.csv';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { DownloadTemplate, ImportButton } from 'src/components/importButton';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { deleteResident, getResident, importResident } from 'src/services/resident';
import { gender as genderOptions, IResident, IResidentParams, residentType } from 'src/services/resident/type';
import { PermistionAction } from 'src/variables/permission';
import { statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

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

	const { toast } = useToastInstance();

	const mutationDelete = useMutation(deleteResident);

	const COLUMNS: Array<IColumn<IResident>> = [
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh', dateFormat: 'DD/MM/YYYY' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp', dateFormat: 'DD/MM/YYYY' },
		{ key: 'identityLocationIssued', label: 'Nơi cấp' },
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

	const { data, isLoading, refetch } = useQuery(['listResident', params, currentPage, currentPageSize], () =>
		getResident({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);
	const mutationImport = useMutation(importResident);

	const onSearch = (payload: Form) => {
		const prepareData = { ...payload, areaId: payload.areaId?.value };
		setParams(prepareData);
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

	const handleImport = async (file: File) => {
		const payload = new FormData();
		payload.append('file', file);
		const type = file.name.split('.') || [];
		payload.append('type', type[type.length - 1]?.toUpperCase());
		try {
			await mutationImport.mutateAsync(payload);
			toast({ title: 'Import thành công' });
			refetch();
		} catch {
			toast({ title: 'Import thất bại', status: 'error' });
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
							<Box hidden={!permistionAction.IMPORT}>
								<DownloadTemplate url={importTemplate} mr={3} />
								{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
								<ImportButton onChangeFile={handleImport} />
							</Box>
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
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={({ id, fullName }) => handleDelete({ id, name: fullName })}
				/>
			</Card>
		</Box>
	);
};

export default ResidentManagement;
