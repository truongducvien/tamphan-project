import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerHookForm } from 'components/form/DatePicker';
import { BaseOption, PullDownHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { formatDate } from 'helpers/dayjs';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { MdResetTv } from 'react-icons/md';
import { getProperty } from 'services/properties';
import { IProperty, IPropertyParams } from 'services/properties/type';
import { getResidentCardReq } from 'services/residentCardReq';
import { IResidentCardReq, IResidentCardReqParams, statusCardReq, typeCardReq } from 'services/residentCardReq/type';
import { PermistionAction } from 'variables/permission';
import * as Yup from 'yup';

interface FormData {
	from?: string;
	to?: string;
	fullName?: string;
	propertyId?: BaseOption<string>;
	status?: typeof statusCardReq[0];
	type?: typeof typeCardReq[0];
}

const validationSchema = Yup.object({
	cardNumber: Yup.string(),
	propertyId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	status: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
});

const ResdidentCardReqManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const [params, setParams] = useState<Omit<IResidentCardReqParams, 'page' | 'size'>>();

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
		getResidentCardReq({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const COLUMNS: Array<IColumn<IResidentCardReq>> = [
		{ key: 'type', label: 'Loại yêu cầu', tag: ({ type }) => typeCardReq.find(i => i.value === type) },
		{ key: 'propertyCode', label: 'Mã căn hộ' },
		{ key: 'requesterPhoneNumber', label: 'Mã số thẻ yêu cầu' },
		{ key: 'requesterName', label: 'Người yêu cầu' },
		{ key: 'requesterPhoneNumber', label: 'Số điện thoại' },
		{ key: 'note', label: 'Ghi chú' },
		{ key: 'requestedDate', label: 'Ngày yêu cầu', dateFormat: 'DD/MM/YYYY' },
		{ key: 'fee', label: 'Phí cấp thẻ' },
		{ key: 'newCardNumber', label: 'Mã số thẻ cấp mới' },
		{ key: 'status', label: 'Trạng thái', tag: ({ status }) => statusCardReq.find(i => i.value === status) },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const onSearch = (payload: FormData) => {
		const preData = {
			...payload,
			from: formatDate(payload.from, { type: 'BE' }),
			to: formatDate(payload.to, { type: 'BE' }),
			propertyId: payload.propertyId?.value,
			status: payload.status?.value,
			type: payload.type?.value,
		};
		setParams(preData);
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} onReset={() => setParams({})} validationSchema={validationSchema}>
						<SimpleGrid spacing={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 2fr)' }} gap={6}>
							<PullDownHookForm label="Loại yêu cầu" name="type" colorScheme="red" isClearable options={typeCardReq} />
							<TextFieldHookForm name="fullName" label="Họ và tên" />
							<PullDownHookForm isClearable label="Trạng thái yêu cầu" name="status" options={statusCardReq} />
							<PullDownHookForm
								isClearable
								label="Căn hộ"
								name="propertyId"
								options={dataProperty?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeyword}
								onLoadMore={fetchMore}
								isLoading={isLoadingProperty}
							/>
							<DatePickerHookForm label="Từ ngày" name="from" />
							<DatePickerHookForm label="Đến ngày" name="to" />
						</SimpleGrid>
						<Flex align="end" justify="end" mt={3}>
							<Button variant="lightBrand" mr={3} type="reset" leftIcon={<MdResetTv />}>
								Mặc định
							</Button>
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách yêu cầu thẻ cư dân
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					minWidth={2000}
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
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default ResdidentCardReqManagement;
