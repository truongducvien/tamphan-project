import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerHookForm } from 'components/form/DatePicker';
import { PullDownHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { MdResetTv } from 'react-icons/md';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { getFacilityGroup } from 'services/facility/group';
import { IFacilityGroup, IFacilityGroupParams } from 'services/facility/group/type';
import { getFacilityRe } from 'services/facilityRegisteration';
import {
	IFacilityRe,
	IFacilityReSearchForm,
	IFacilityReSearchPayload,
	paymentMethods,
	statusFacilityRe,
} from 'services/facilityRegisteration/type';
import { PermistionAction } from 'variables/permission';

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
		payload: { name: keywordAreaDebound },
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
		{ key: 'reservationDate', label: 'Ngày đặt chỗ' },
		{
			key: 'bookingTimeSlot',
			label: 'Giờ đặt chỗ',
			cell: ({ bookingTimeSlot }) => `${bookingTimeSlot?.start} - ${bookingTimeSlot?.end}`,
		},
		{ key: 'quantityOfPerson', label: 'Số lượng' },
		{ key: 'depositAmount', label: 'Số tiền đặt cọc' },
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
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
