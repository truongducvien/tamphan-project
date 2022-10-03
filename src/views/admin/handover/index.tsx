import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { getHandover } from 'src/services/handover';
import { handOverBookingStatus, IHandover, IHandoverParams } from 'src/services/handover/type';
import { statusProperty, typeProperty } from 'src/services/properties/type';
import { PermistionAction } from 'src/variables/permission';

const HandoverManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const keywordRef = useRef<HTMLInputElement>(null);
	const [params, setParams] = useState<IHandoverParams>({});
	const { data, isLoading } = useQuery(
		['listHandover', params, currentPage, pageSize],
		() =>
			getHandover({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);
	const { changeAction } = useActionPage();

	const COLUMNS: Array<IColumn<IHandover>> = [
		{ key: 'property', label: 'Mã tài sản', cell: ({ property }) => property?.code },
		{ key: 'property', label: 'Phân khu', cell: ({ property }) => property?.areaName },
		{ key: 'residentFullName', label: 'Họ tên khách hàng' },
		{ key: 'residentPhoneNumber', label: 'Số điện thoại khách hàng' },
		{
			key: 'property',
			label: 'Trạng thái tài sản',
			tag: ({ property }) => statusProperty.find(i => i.value === property?.status),
		},
		{
			key: 'property',
			label: 'Trạng thái đặt lịch',
			tag: ({ bookingStatus }) => handOverBookingStatus.find(i => i.value === bookingStatus),
		},
		{ key: 'createdDate', label: 'Ngày tạo' },
		{ key: 'updatedDate', label: 'Ngày cập nhật' },
	];

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer>
						<SimpleGrid spacing={3} columns={{ base: 1, md: 4 }} mb={3}>
							<TextFieldHookForm name="code" label="Mã tài sản" />
							<TextFieldHookForm name="fullName" label="Tên khách hàng" />
							<PullDownHookForm label="Trạng thái tài sản" options={statusProperty} name="status" />
							<PullDownHookForm label="Trạng thái đặt lịch" options={handOverBookingStatus} name="bookingStatus" />
						</SimpleGrid>
						<Flex align="end" justify="end">
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button
								marginLeft={1}
								hidden={!permistionAction.ADD}
								onClick={() => changeAction('create')}
								variant="brand"
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách tài sản bàn giao
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWidth={1200}
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default HandoverManagement;
