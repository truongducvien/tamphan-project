import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
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
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams } from 'src/services/properties/type';
import { getReport } from 'src/services/report';
import {
	IReport,
	IReportParams,
	ReportStatus,
	reportStatusOption,
	reportTypeOptions,
	ReportTypes,
} from 'src/services/report/type';
import { PermistionAction } from 'src/variables/permission';
import * as Yup from 'yup';

interface FormData {
	status?: BaseOption<ReportStatus>;
	propertyCode?: BaseOption<string>;
	areaId?: BaseOption<string>;
	reportPersonName?: string;
	type?: BaseOption<ReportTypes>;
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

const ReportManagement: React.FC = () => {
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebounce = useDebounce(keywordArea);
	const [keywordProperty, setKeywordProperty] = useState('');
	const keywordPropertyDebounce = useDebounce(keywordProperty);

	const [params, setParams] = useState<Omit<IReportParams, 'page' | 'size'>>();

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
			getReport({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IReport>> = [
		{ key: 'property', label: 'Mã căn hộ', cell: ({ property }) => property?.code },
		{ key: 'property', label: 'Phân khu', cell: ({ property }) => property?.areaName },
		{ key: 'mandator', label: 'Người phản ánh', cell: ({ mandator }) => mandator?.fullName },
		{ key: 'mandator', label: 'Số điện thoại', cell: ({ mandator }) => mandator?.phoneNumber },
		{ key: 'mandator', label: 'Vai trò', cell: ({ mandator }) => mandator?.phoneNumber },

		{
			key: 'type',
			label: 'Loại yêu cầu',
			tag: ({ type }) => reportTypeOptions.find(i => i.value === type),
		},
		{
			key: 'authorizationDetail',
			label: 'Nội dung hỗ trợ',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ authorizationDetail }) => (
				<Text fontWeight={700} maxH={50} textOverflow="ellipsis">
					{authorizationDetail}
				</Text>
			),
		},
		{ key: 'createdDate', label: 'Thời gian tạo', dateFormat: 'DD/MM/YYYY' },
		{ key: 'createdDate', label: 'Thời gian dự kiến hoàn thành', dateFormat: 'DD/MM/YYYY' },
		{ key: 'createdDate', label: 'Thời gian hoành thành thực tế', dateFormat: 'DD/MM/YYYY' },

		{
			key: 'status',
			label: 'Trạng thái xử lí',
			tag: ({ status }) => reportStatusOption.find(i => i.value === status),
		},
		{ key: 'code', label: 'Mã phản ánh' },
		{ key: 'createdDate', label: 'Ngày tiếp nhận', dateFormat: 'DD/MM/YYYY' },
		{ key: 'createdBy', label: 'Người tiếp nhận' },
	];

	const onSearch = (payload: FormData) => {
		resetPage();
		const preData = {
			...payload,
			status: payload.status?.value,
			areaId: payload.areaId?.value,
			propertyCode: payload.propertyCode?.value,
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
								name="propertyCode"
								options={dataProperty?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeywordProperty}
								onLoadMore={fetchMoreProperty}
								isLoading={isLoadingProperty}
							/>
							<PullDownHookForm isClearable label="Trạng thái xử lí" name="status" options={reportStatusOption} />
							<TextFieldHookForm name="reportPersonName" label="Người phản ánh" />
							<PullDownHookForm isClearable label="Loại yêu cầu" name="tyoe" options={reportTypeOptions} />
							<DatePickerHookForm label="Từ ngày" name="from" />
							<DatePickerHookForm label="Đến ngày" name="to" />
						</SimpleGrid>
						<Flex align="end" justify="end" mt={3}>
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

export default ReportManagement;
