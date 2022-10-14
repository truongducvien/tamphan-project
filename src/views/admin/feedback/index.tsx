import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdResetTv } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import useActionPage from 'src/hooks/useActionPage';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { usePagination } from 'src/hooks/usePagination';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { getFeedback } from 'src/services/feedback';
import {
	IFeedback,
	IFeedbackParams,
	FeedbackStatus,
	feedbackStatusOption,
	feedbackTypeOptions,
	FeedbackTypes,
} from 'src/services/feedback/type';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams } from 'src/services/properties/type';
import { residentType } from 'src/services/resident/type';
import { PermistionAction } from 'src/variables/permission';
import * as Yup from 'yup';

interface FormData {
	status?: BaseOption<FeedbackStatus>;
	propertyId?: BaseOption<string>;
	areaId?: BaseOption<string>;
	fullName?: string;
	type?: BaseOption<FeedbackTypes>;
	from?: string;
	to?: string;
}

const validationSchema = Yup.object({
	areaId: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	propertyCode: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	status: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
});

const FeedbackManagement: React.FC = () => {
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebounce = useDebounce(keywordArea);
	const [keywordProperty, setKeywordProperty] = useState('');
	const keywordPropertyDebounce = useDebounce(keywordProperty);

	const [params, setParams] = useState<Omit<IFeedbackParams, 'page' | 'size'>>();

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebounce],
		func: getArea,
		payload: { code: keywordAreaDebounce },
	});

	const {
		data: dataProperty,
		isLoading: isLoadingProperty,
		fetchMore: fetchMoreProperty,
	} = useLoadMore<IProperty, IPropertyParams>({
		id: ['listAreaProperty', keywordPropertyDebounce],
		func: getProperty,
		payload: { code: keywordPropertyDebounce },
	});

	const { data, isLoading } = useQuery(
		['listResidentAuthReq', params, currentPage, pageSize],
		() =>
			getFeedback({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IFeedback>> = [
		{ key: 'propertyCode', label: 'Mã căn hộ' },
		{ key: 'areaName', label: 'Phân khu' },
		{ key: 'residentFullName', label: 'Người phản ánh' },
		{ key: 'residentPhoneNumber', label: 'Số điện thoại' },
		{
			key: 'residentType',
			label: 'Vai trò',
			tag: ({ residentType: residentTypeFB }) => residentType.find(i => i.value === residentTypeFB),
		},

		{
			key: 'type',
			label: 'Loại yêu cầu',
			tag: ({ type }) => feedbackTypeOptions.find(i => i.value === type),
		},
		{
			key: 'title',
			label: 'Nội dung hỗ trợ',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ title }) => (
				<Text fontWeight={700} maxH={50} textOverflow="ellipsis">
					{title}
				</Text>
			),
		},
		{ key: 'createdAt', label: 'Thời gian tạo', dateFormat: 'DD/MM/YYYY' },
		{ key: 'expectedDate', label: 'Thời gian dự kiến hoàn thành', dateFormat: 'DD/MM/YYYY' },
		{ key: 'actualDate', label: 'Thời gian hoành thành thực tế', dateFormat: 'DD/MM/YYYY' },

		{
			key: 'status',
			label: 'Trạng thái xử lí',
			tag: ({ status }) => feedbackStatusOption.find(i => i.value === status),
		},
		{ key: 'id', label: 'Mã phản ánh' },
		{ key: 'receiveDate', label: 'Ngày tiếp nhận', dateFormat: 'DD/MM/YYYY' },
		{ key: 'operatorFullName', label: 'Người tiếp nhận' },
	];

	const onSearch = (payload: FormData) => {
		resetPage();
		const preData = {
			...payload,
			status: payload.status?.value,
			areaId: payload.areaId?.value,
			propertyId: payload.propertyId?.value,
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
							<PullDownHookForm
								isClearable
								label="Phân khu"
								name="areaId"
								options={dataArea?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeywordArea}
								onLoadMore={fetchMoreArea}
								isLoading={isLoadingArea}
							/>
							<PullDownHookForm
								isClearable
								label="Mã căn hộ"
								name="propertyId"
								options={dataProperty?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeywordProperty}
								onLoadMore={fetchMoreProperty}
								isLoading={isLoadingProperty}
							/>
							<PullDownHookForm isClearable label="Trạng thái xử lí" name="status" options={feedbackStatusOption} />
							<TextFieldHookForm name="fullName" label="Người phản ánh" />
							<PullDownHookForm isClearable label="Loại yêu cầu" name="tyoe" options={feedbackTypeOptions} />
							<DatePickerHookForm label="Từ ngày" name="from" />
							<DatePickerHookForm label="Đến ngày" name="to" />
						</SimpleGrid>
						<Flex align="end" justify="end" mt={3}>
							<Button variant="lightBrand" type="reset" mr="3" leftIcon={<MdResetTv />}>
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
						Danh sách phản ánh
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

export default FeedbackManagement;
