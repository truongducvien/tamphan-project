import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdResetTv } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { currency } from 'src/helpers/currency';
import { formatDate } from 'src/helpers/dayjs';
import useActionPage from 'src/hooks/useActionPage';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { getFacilityGroup } from 'src/services/facility/group';
import { IFacilityGroup, IFacilityGroupParams } from 'src/services/facility/group/type';
import { getFacilityRe } from 'src/services/facilityRegisteration';
import {
	IFacilityRe,
	IFacilityReSearchForm,
	IFacilityReSearchPayload,
	paymentMethods,
	statusFacilityRe,
} from 'src/services/facilityRegisteration/type';
import { PermistionAction } from 'src/variables/permission';

const FacilityReManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [param, setParams] = useState<Omit<IFacilityReSearchPayload, 'page' | 'size'>>({});

	const [keyword, setKeywordGroup] = useState('');
	const keywordDebound = useDebounce(keyword);
	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebound = useDebounce(keywordArea);

	const { data, isLoading } = useQuery(['listFacilityRe', param, currentPage, currentPageSize], () =>
		getFacilityRe({ ...param, page: currentPage - 1, size: currentPageSize }),
	);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { code: keywordAreaDebound },
	});

	const {
		data: dataGroup,
		isLoading: isLoadingGroup,
		fetchMore: fetchMoreGroup,
	} = useLoadMore<IFacilityGroup, IFacilityGroupParams>({
		id: ['listGroup', keywordDebound],
		func: getFacilityGroup,
		payload: { name: keywordDebound },
	});

	const COLUMNS: Array<IColumn<IFacilityRe>> = [
		{ key: 'facilityName', label: 'Tên tiện ích' },
		{ key: 'userName', label: 'Tên người đặt' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'bookingCode', label: 'Mã đặt chỗ' },
		{ key: 'reservationDate', label: 'Ngày sử dụng' },
		{
			key: 'bookingTimeSlot',
			label: 'Giờ sử dụng',
			cell: ({ bookingTimeSlot }) => `${bookingTimeSlot?.start} - ${bookingTimeSlot?.end}`,
		},
		{ key: 'quantityOfPerson', label: 'Số lượng' },
		{
			key: 'depositAmount',
			label: 'Số tiền đặt cọc',
			cell: ({ depositAmount }) => currency(depositAmount.amount, depositAmount.currency),
		},
		{ key: 'status', label: 'Trạng thái', tag: ({ status }) => statusFacilityRe.find(i => i.value === status) },
		{ key: 'note', label: 'Mô tả' },
		{
			key: 'paymentMethod',
			label: 'Phhương thức thanh toán',
			tag: ({ paymentMethod }) => paymentMethods.find(i => i.value === paymentMethod),
		},
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const onSearch = (dt: IFacilityReSearchForm) => {
		const prepareData = {
			...dt,
			bookingFromTime: formatDate(dt.bookingFromTime, { type: 'BE' }),
			bookingToTime: formatDate(dt.bookingToTime, { type: 'BE' }),
			areaId: dt.areaId?.value as string,
			facilityGroupId: dt.facilityGroupId?.value as string,
		};
		setParams(prev => ({ ...prev, ...prepareData }));
	};

	const onReset = () => {
		setParams({});
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} onReset={onReset}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={3}>
							<DatePickerHookForm label="Từ ngày" name="bookingFromTime" />
							<DatePickerHookForm label="Đến ngày" name="bookingToTime" />
							<TextFieldHookForm label="Tên tiện ích" name="facilityName" />
							<PullDownHookForm
								label="Loại tiện ích"
								name="facilityGroupId"
								isLoading={isLoadingGroup}
								onLoadMore={fetchMoreGroup}
								options={dataGroup.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordGroup}
								isClearable
							/>
							<PullDownHookForm
								label="Phân khu"
								name="areaId"
								isLoading={isLoadingArea}
								onLoadMore={fetchMoreArea}
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordArea}
								isClearable
							/>
							<Flex align="end" justify="end">
								<Button variant="lightBrand" mr={3} type="reset" leftIcon={<MdResetTv />}>
									Mặc định
								</Button>
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
							</Flex>
						</SimpleGrid>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách đăng ký tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
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
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default FacilityReManagement;
