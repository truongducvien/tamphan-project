import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerdHookForm } from 'components/form/DatePicker';
import { BaseOption, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { useDebounce } from 'hooks/useDebounce';
import { MdResetTv } from 'react-icons/md';
import { getApartment } from 'services/apartment';
import { getResidentCardReq } from 'services/residentCardReq';
import { IResidentCardReq, IResidentCardReqParams, statusCardReq, typeCardReq } from 'services/residentCardReq/type';
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

	const { data: dataApartment } = useQuery(['listApartment', keywordDebounce], () =>
		getApartment({
			code: keywordDebounce,
		}),
	);

	const { data, isLoading } = useQuery(['listResidentCard', params, currentPage, currentPageSize], () =>
		getResidentCardReq({
			page: currentPage,
			size: currentPageSize,
			...params,
		}),
	);

	const COLUMNS: Array<IColumn<IResidentCardReq>> = [
		{ key: 'type', label: 'Loại yêu cầu', cell: ({ type }) => typeCardReq.find(i => i.value === type)?.label },
		{ key: 'propertyCode', label: 'Mã căn hộ' },
		{ key: 'requesterPhoneNumber', label: 'Mã số thẻ yêu cầu' },
		{ key: 'requesterName', label: 'Người yêu cầu' },
		{ key: 'requesterPhoneNumber', label: 'Số điện thoại' },
		{ key: 'note', label: 'Ghi chú' },
		{ key: 'requestedDate', label: 'Ngày yêu cầu' },
		{ key: 'fee', label: 'Phí cấp thẻ' },
		{ key: 'newCardNumber', label: 'Mã số thẻ cấp mới' },
		{ key: 'status', label: 'Trạng thái', cell: ({ status }) => statusCardReq.find(i => i.value === status)?.label },
	];

	const pageInfo = {
		total: data?.totalItems,
		hasNextPage: data ? data?.pageNum < data?.totalPages : false,
		hasPreviousPage: data ? data?.pageNum < 0 : false,
	};

	const onSearch = (payload: FormData) => {
		const preData = {
			...payload,
			propertyId: payload.propertyId?.value,
			status: payload.status?.value,
			type: payload.type?.value,
		};
		setParams(preData);
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} validationSchema={validationSchema}>
						<SimpleGrid spacing={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 2fr)' }} gap={6}>
							<PullDowndHookForm label="Loại yêu cầu" name="type" isClearable options={typeCardReq} />
							<TextFieldHookForm name="fullName" label="Họ và tên" />
							<PullDowndHookForm isClearable label="Trạng thái yêu cầu" name="status" options={statusCardReq} />
							<PullDowndHookForm
								isClearable
								label="Căn hộ"
								name="propertyId"
								options={dataApartment?.items.map(i => ({ label: i.code, value: i.id })) || []}
							/>
							<DatePickerdHookForm label="Từ ngày" name="from" />
							<DatePickerdHookForm label="Đến ngày" name="to" />
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
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách yêu cầu thẻ cư dân
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					testId="consignments-dashboard"
					keyField="name"
					columns={COLUMNS}
					data={data?.items || []}
					pagination={{
						total: Number(pageInfo?.total || 0),
						pageSize: currentPageSize,
						value: currentPage,
						hasNextPage: pageInfo?.hasNextPage,
						hasPreviousPage: pageInfo?.hasPreviousPage,
						onPageChange: page => setCurrentPage(page),
						onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					}}
				/>
			</Card>
		</Box>
	);
};

export default ResdidentCardReqManagement;
