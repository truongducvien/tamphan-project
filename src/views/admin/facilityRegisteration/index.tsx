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
import { usePagination } from 'src/hooks/usePagination';
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
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();
	const [param, setParams] = useState<Omit<IFacilityReSearchPayload, 'page' | 'size'>>({});
	const [keyword, setKeywordGroup] = useState('');
	const keywordDebound = useDebounce(keyword);
	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebound = useDebounce(keywordArea);

	const { data, isLoading } = useQuery(
		['listFacilityRe', param, currentPage, pageSize],
		() => getFacilityRe({ ...param, page: currentPage - 1, size: pageSize }),
		{ onSuccess: d => dispatchInfo(d) },
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
		{ key: 'facilityName', label: 'T??n ti???n ??ch' },
		{ key: 'userName', label: 'T??n ng?????i ?????t' },
		{ key: 'phoneNumber', label: 'S??? ??i???n tho???i' },
		{ key: 'bookingCode', label: 'M?? ?????t ch???' },
		{ key: 'areaName', label: 'T??n ph??n khu' },
		{ key: 'propertyCode', label: 'M?? c??n h???' },
		{ key: 'reservationDate', label: 'Ng??y s??? d???ng', dateFormat: 'DD/MM/YYYY' },
		{
			key: 'bookingTimeSlot',
			label: 'Gi??? s??? d???ng',
			cell: ({ bookingTimeSlot }) => `${bookingTimeSlot?.start} - ${bookingTimeSlot?.end}`,
		},
		{ key: 'quantityOfPerson', label: 'S??? l?????ng' },
		{
			key: 'depositAmount',
			label: 'S??? ti???n ?????t c???c',
			cell: ({ depositAmount }) => currency(depositAmount.amount, depositAmount.currency),
		},
		{ key: 'status', label: 'Tr???ng th??i', tag: ({ status }) => statusFacilityRe.find(i => i.value === status) },
		{ key: 'note', label: 'M?? t???' },
		{
			key: 'paymentMethod',
			label: 'Ph????ng th???c thanh to??n',
			tag: ({ paymentMethod }) => paymentMethods.find(i => i.value === paymentMethod),
		},
	];

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
		resetPage();
		setParams({});
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} onReset={onReset}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={3}>
							<DatePickerHookForm label="T??? ng??y" name="bookingFromTime" />
							<DatePickerHookForm label="?????n ng??y" name="bookingToTime" />
							<TextFieldHookForm label="T??n ti???n ??ch" name="facilityName" />
							<PullDownHookForm
								label="Lo???i ti???n ??ch"
								name="facilityGroupId"
								isLoading={isLoadingGroup}
								onLoadMore={fetchMoreGroup}
								options={dataGroup.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordGroup}
								isClearable
							/>
							<PullDownHookForm
								label="Ph??n khu"
								name="areaId"
								isLoading={isLoadingArea}
								onLoadMore={fetchMoreArea}
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordArea}
								isClearable
							/>
							<Flex align="end" justify="end">
								<Button variant="lightBrand" mr={3} type="reset" leftIcon={<MdResetTv />}>
									M???c ?????nh
								</Button>
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									T??m ki???m
								</Button>
							</Flex>
						</SimpleGrid>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh s??ch ????ng k?? ti???n ??ch
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWith="2000px"
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default FacilityReManagement;
