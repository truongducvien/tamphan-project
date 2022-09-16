import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import importTemplate from 'src/assets/templates/residentCard.csv';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { DownloadTemplate, ImportButton } from 'src/components/importButton';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams } from 'src/services/properties/type';
import { getResidentCard, importResidentCard } from 'src/services/residentCard';
import { IResidentCard, IResidentCardParams } from 'src/services/residentCard/type';
import { Status, statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

interface FormData {
	propertyId: Option;
	cardNumber: string;
	state: Option;
}

const validationSchema = Yup.object({
	cardNumber: Yup.string(),
	propertyId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	state: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
});

const ResdidentCardManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const { toast } = useToastInstance();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const [params, setParams] = useState<Omit<IResidentCardParams, 'page' | 'size'>>();

	const {
		data: dataProperty,
		isLoading: isLoadingProperty,
		fetchMore,
	} = useLoadMore<IProperty, IPropertyParams>({
		id: ['listProperty', keywordDebounce],
		func: getProperty,
		payload: { code: keywordDebounce },
	});

	const { data, isLoading, refetch } = useQuery(['listResidentCard', params, currentPage, currentPageSize], () =>
		getResidentCard({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const mutationImport = useMutation(importResidentCard);

	const COLUMNS: Array<IColumn<IResidentCard>> = [
		{ key: 'cardNumber', label: 'Mã số thẻ' },
		{ key: 'property', label: 'Mã căn hộ', cell: ({ property }) => property?.code },
		{ key: 'state', label: 'Trạng thái thẻ', tag: ({ state }) => statusOption2.find(i => i.value === state) },
		{ key: 'updatedDate', label: 'Ngày cập nhật' },
		{ key: 'modifyBy', label: 'Người cập nhật' },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const onSearch = (payload: FormData) => {
		const preData = {
			...payload,
			propertyId: payload.propertyId?.value as string,
			state: payload.state?.value as Status,
		};
		setParams(preData);
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

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} validationSchema={validationSchema}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'left', xl: 'left' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<TextFieldHookForm name="cardNumber" label="Mã số thẻ" />
							<PullDownHookForm
								label="Căn hộ"
								name="propertyId"
								onInputChange={setKeyword}
								isClearable
								onLoadMore={fetchMore}
								isLoading={isLoadingProperty}
								options={dataProperty?.map(i => ({ label: `${i.code} - ${i.name}`, value: i.id })) || []}
							/>
							<PullDownHookForm isClearable label="Trạng thái thẻ" name="state" options={statusOption2} />
						</Stack>
						<Flex justifyContent="end" mt={3}>
							<Box hidden={!permistionAction.IMPORT}>
								<DownloadTemplate url={importTemplate} mr={3} />
								{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
								<ImportButton onChangeFile={handleImport} />
							</Box>
							<Button ml={3} variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách thẻ cư dân
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
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
				/>
			</Card>
		</Box>
	);
};

export default ResdidentCardManagement;
