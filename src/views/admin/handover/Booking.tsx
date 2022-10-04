import React, { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	SimpleGrid,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdImportExport } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { Tag } from 'src/components/tag';
import { useToastInstance } from 'src/components/toast';
import { formatDate } from 'src/helpers/dayjs';
import { BaseComponentProps } from 'src/hocs/withPermission';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { acceptHandover, completedHandover, getHandoverBooking, removeHandover } from 'src/services/handover';
import {
	handOverBookingStatus,
	HandOverBookingStatusKey,
	IHandoverBooking,
	IHandoverBookingParams,
} from 'src/services/handover/type';

interface Form {
	residentFullName?: string;
	propertyCode?: string;
	from?: string;
	to?: string;
	fullName?: string;
	bookingStatus?: BaseOption<HandOverBookingStatusKey>;
}

const UpdateTag: React.FC<{ row: IHandoverBooking; onUpdate: () => void }> = ({ row, onUpdate }) => {
	const { id, bookingStatus } = row;
	const { toast } = useToastInstance();
	const column = handOverBookingStatus.find(i => i.value === bookingStatus);
	const { mutateAsync: acceptAsync, isLoading: isAccepting } = useMutation(acceptHandover);
	const { mutateAsync: completedAsync, isLoading: isCompleting } = useMutation(completedHandover);

	const handleUpdate = async () => {
		if (!['WAITING', 'APPROVED'].includes(bookingStatus)) return;
		const next = await alert({
			title: 'Cập nhật trạng thái',
			description: `Bạn có muốn chuyển trạng thái hoàn tất cho mã booking ${id} không?`,
		});
		if (!next) return;
		try {
			switch (bookingStatus) {
				case 'WAITING':
					await acceptAsync(id);
					break;
				case 'APPROVED':
					await completedAsync(id);
					break;
				default:
					throw Error('bookingStatus not accept');
			}
			toast({ title: 'Cập nhật trạng thái thành công' });
			onUpdate();
		} catch {
			toast({ title: 'Cập nhật trạng thái thất bại', status: 'error' });
		}
	};

	return column ? (
		<Center>
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<Tag
				cursor={['WAITING', 'APPROVED'].includes(bookingStatus) ? 'pointer' : 'not-allowed'}
				colorScheme={column.colorScheme}
				onClick={handleUpdate}
			>
				{column.label}
			</Tag>
		</Center>
	) : null;
};

const HandoverBooing: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [params, setParams] = useState<IHandoverBookingParams>({});
	const { data, isLoading, refetch } = useQuery(
		['listHandoverBooking', params, currentPage, pageSize],
		() =>
			getHandoverBooking({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);
	const history = useHistory();

	const COLUMNS: Array<IColumn<IHandoverBooking>> = [
		{
			key: 'bookingDate',
			label: 'Ngày hẹn bàn giao',
		},
		{ key: 'id', label: 'Mã booking' },
		{ key: 'residentFullName', label: 'Họ tên khách hàng' },
		{ key: 'residentEmail', label: 'Email khách hàng' },
		{ key: 'residentPhoneNumber', label: 'Số điện thoại khách hàng' },
		{
			key: 'property',
			label: 'Mã tài sản',
			cell: ({ property }) => property?.code,
		},
		{
			key: 'note',
			label: 'Ghi chú',
		},
		{
			key: 'bookingStatus',
			label: 'Trạng thái đặt lịch',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: row => <UpdateTag row={row} onUpdate={refetch} />,
		},
		{ key: 'createdDate', label: 'Ngày tạo', dateFormat: 'DD/MM/YYYY' },
		{ key: 'updatedDate', label: 'Ngày cập nhật', dateFormat: 'DD/MM/YYYY' },
	];

	const handleSearch = (payload: Form) => {
		resetPage();
		setParams({
			...payload,
			from: formatDate(payload.from, { type: 'BE' }),
			to: formatDate(payload.to, { type: 'BE' }),
			bookingStatus: payload.bookingStatus?.value,
		});
	};

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={handleSearch}>
						<SimpleGrid spacing={3} columns={{ base: 1, md: 3 }} mb={3}>
							<TextFieldHookForm name="code" label="Mã tài sản" />
							<TextFieldHookForm name="fullName" label="Tên khách hàng" />
							<PullDownHookForm label="Trạng thái đặt lịch" options={handOverBookingStatus} name="bookingStatus" />
							<DatePickerHookForm label="Từ ngày" name="from" />
							<DatePickerHookForm label="Đến ngày" name="to" />
							<Flex align="end" justify="end">
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
								<Button
									marginLeft={1}
									// hidden={!permistionAction.ADD}
									onClick={() => history.push('/admin/handover/booking')}
									variant="brand"
									leftIcon={<MdImportExport />}
								>
									Export
								</Button>
							</Flex>
						</SimpleGrid>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách đặt lịch bàn giao
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWidth={1500}
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{ value: currentPage, pageSize, ...pagination }}
				/>
			</Card>
		</Box>
	);
};

export default HandoverBooing;
