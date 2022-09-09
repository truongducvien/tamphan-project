import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDownHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { ImportButton } from 'components/importButton';
import Table, { IColumn } from 'components/table';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { getProperty } from 'services/properties';
import { IProperty, IPropertyParams } from 'services/properties/type';
import { getResidentCard } from 'services/residentCard';
import { IResidentCard, IResidentCardParams } from 'services/residentCard/type';
import { Status, statusOption2 } from 'variables/status';
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

const ResdidentCardManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

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

	const { data, isLoading } = useQuery(['listResidentCard', params, currentPage, currentPageSize], () =>
		getResidentCard({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

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
							<Flex align="center">
								<ImportButton />
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
							</Flex>
						</Stack>
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
