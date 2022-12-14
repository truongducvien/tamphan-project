import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdResetTv } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { formatDate } from 'src/helpers/dayjs';
import useActionPage from 'src/hooks/useActionPage';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { usePagination } from 'src/hooks/usePagination';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams } from 'src/services/properties/type';
import { getResidentCardReq } from 'src/services/residentCardReq';
import {
	IResidentCardReq,
	IResidentCardReqParams,
	statusCardReq,
	typeCardReq,
} from 'src/services/residentCardReq/type';
import { PermistionAction } from 'src/variables/permission';
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
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

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

	const { data, isLoading } = useQuery(
		['listResidentCard', params, currentPage, pageSize],
		() =>
			getResidentCardReq({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IResidentCardReq>> = [
		{ key: 'type', label: 'Lo???i y??u c???u', tag: ({ type }) => typeCardReq.find(i => i.value === type) },
		{ key: 'propertyCode', label: 'M?? c??n h???' },
		{ key: 'requesterPhoneNumber', label: 'M?? s??? th??? y??u c???u' },
		{ key: 'requesterName', label: 'Ng?????i y??u c???u' },
		{ key: 'requesterPhoneNumber', label: 'S??? ??i???n tho???i' },
		{ key: 'note', label: 'Ghi ch??' },
		{ key: 'requestedDate', label: 'Ng??y y??u c???u', dateFormat: 'DD/MM/YYYY' },
		{ key: 'fee', label: 'Ph?? c???p th???' },
		{ key: 'newCardNumber', label: 'M?? s??? th??? c???p m???i' },
		{ key: 'status', label: 'Tr???ng th??i', tag: ({ status }) => statusCardReq.find(i => i.value === status) },
	];

	const onSearch = (payload: FormData) => {
		resetPage();
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
							<PullDownHookForm label="Lo???i y??u c???u" name="type" colorScheme="red" isClearable options={typeCardReq} />
							<TextFieldHookForm name="fullName" label="H??? v?? t??n" />
							<PullDownHookForm isClearable label="Tr???ng th??i y??u c???u" name="status" options={statusCardReq} />
							<PullDownHookForm
								isClearable
								label="C??n h???"
								name="propertyId"
								options={dataProperty?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeyword}
								onLoadMore={fetchMore}
								isLoading={isLoadingProperty}
							/>
							<DatePickerHookForm label="T??? ng??y" name="from" />
							<DatePickerHookForm label="?????n ng??y" name="to" />
						</SimpleGrid>
						<Flex align="end" justify="end" mt={3}>
							<Button variant="lightBrand" mr={3} type="reset" leftIcon={<MdResetTv />}>
								M???c ?????nh
							</Button>
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								T??m ki???m
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh s??ch y??u c???u th??? c?? d??n
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					minWidth={2000}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default ResdidentCardReqManagement;
