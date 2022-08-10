import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerdHookForm } from 'components/form/DatePicker';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { MdResetTv } from 'react-icons/md';
import { getArea } from 'services/area';
import { getUtilsGroup } from 'services/utils/group';
import { getUtilsRe } from 'services/utilsRegisteration';
import { IUtilsRe, IUtilsReSearchForm, IUtilsReSearchPayload } from 'services/utilsRegisteration/type';
import { PermistionAction } from 'variables/permission';

const UtilsReManagement: React.FC = () => {
	const { toast } = useToastInstance();
	const [currentPage, setCurrentPage] = useState(0);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);
	const [param, setParams] = useState<Omit<IUtilsReSearchPayload, 'page' | 'size'>>({});

	const [keyword, setKeywordGroup] = useState('');
	const keywordDebound = useDebounce(keyword);
	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebound = useDebounce(keywordArea);

	const { data } = useQuery(
		['list', param, currentPage, currentPageSize],
		() => getUtilsRe({ ...param, page: currentPage, size: currentPage }),
		{
			onError: () => toast({ status: 'error', title: 'Qerry thất bại' }),
		},
	);

	const { data: dataArea } = useQuery(['list', keywordAreaDebound], () => getArea({ name: keywordAreaDebound }));

	const { data: dataGroup } = useQuery(['listGroup', keywordDebound], () => getUtilsGroup(keywordDebound));

	const COLUMNS: Array<IColumn<IUtilsRe>> = [
		{ key: 'amenitiesName', label: 'Tên tiện ích' },
		{ key: 'userName', label: 'Tên người đặt' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{
			key: 'bookingTimeSlot',
			label: 'Giờ đặt chỗ',
			cell: ({ bookingTimeSlot }) => `${bookingTimeSlot.start} - ${bookingTimeSlot.end}`,
		},
		{ key: 'reservationDate', label: 'Ngày đặt chỗ' },
		{ key: 'quantityOfPerson', label: 'Số lượng' },
		{ key: 'depositAmount', label: 'Số tiền đặt cọc' },
		{ key: 'status', label: 'Trạng thái' },
		{ key: 'note', label: 'Mô tả' },
		{ key: 'paymentMethod', label: 'Phhương thức thanh toán' },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? data?.pageNum < data?.totalPages : false,
		hasPreviousPage: data ? data?.pageNum < 0 : false,
	};

	const onSearch = (dt: IUtilsReSearchForm) => {
		const prepareData = {
			...dt,
			areaId: dt.areaId.value as string,
			amenitiesGroupId: dt.amenitiesGroupId.value as string,
		};
		setParams(prev => ({ ...prev, ...prepareData }));
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={3}>
							<DatePickerdHookForm label="Từ ngày" name="bookingFromTime" />
							<DatePickerdHookForm label="Đến ngày" name="bookingToTime" />
							<TextFieldHookForm label="Tên tiện ích" name="amenitiesName" />
							<PullDowndHookForm
								label="Loại tiện ích"
								name="amenitiesGroupId"
								options={dataGroup?.items.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeywordGroup}
								isClearable
							/>
							<PullDowndHookForm
								label="Phân khu"
								name="areaId"
								options={dataArea?.items.map(i => ({ label: i.name, value: i.id })) || []}
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
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách dăng kí tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWith="1500px"
					// onSelectionChange={handleSelectionChange}
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
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default UtilsReManagement;
