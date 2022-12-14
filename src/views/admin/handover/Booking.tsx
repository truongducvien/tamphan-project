import React, { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
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
import { acceptHandover, completedHandover, getHandoverBooking } from 'src/services/handover';
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
	const { permistionAction } = useActionPermission('HANOVER_BOOKING_MANAGEMENT');
	const { toast } = useToastInstance();
	const column = handOverBookingStatus.find(i => i.value === bookingStatus);
	const { mutateAsync: acceptAsync, isLoading: isAccepting } = useMutation(acceptHandover);
	const { mutateAsync: completedAsync, isLoading: isCompleting } = useMutation(completedHandover);

	const handleUpdate = async () => {
		if (!['WAITING', 'APPROVED'].includes(bookingStatus) || !permistionAction.UPDATE) return;
		const next = await alert({
			title: 'C???p nh???t tr???ng th??i',
			description: `B???n c?? mu???n chuy???n tr???ng th??i ho??n t???t cho m?? booking ${id} kh??ng?`,
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
			toast({ title: 'C???p nh???t tr???ng th??i th??nh c??ng' });
			onUpdate();
		} catch {
			toast({ title: 'C???p nh???t tr???ng th??i th???t b???i', status: 'error' });
		}
	};

	return column ? (
		<Center>
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<Tag
				cursor={['WAITING', 'APPROVED'].includes(bookingStatus) || !permistionAction.UPDATE ? 'pointer' : 'not-allowed'}
				colorScheme={column.colorScheme}
				onClick={handleUpdate}
			>
				{column.label}
			</Tag>
		</Center>
	) : null;
};

const HandoverBooing: React.FC<BaseComponentProps> = () => {
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
			label: 'Ng??y h???n b??n giao',
		},
		{ key: 'code', label: 'M?? booking' },
		{ key: 'residentHandoverName', label: 'H??? t??n kh??ch h??ng' },
		{ key: 'residentHandoverEmail', label: 'Email kh??ch h??ng' },
		{ key: 'residentHandoverPhoneNumber', label: 'S??? ??i???n tho???i kh??ch h??ng' },
		{
			key: 'property',
			label: 'M?? t??i s???n',
			cell: ({ property }) => property?.code,
		},
		{
			key: 'note',
			label: 'Ghi ch??',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ note }) => (
				<Text fontSize={12} maxH={100} overflow="scroll">
					{note}
				</Text>
			),
		},
		{
			key: 'bookingStatus',
			label: 'Tr???ng th??i ?????t l???ch',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: row => <UpdateTag row={row} onUpdate={refetch} />,
		},
		{ key: 'createdDate', label: 'Ng??y t???o', dateFormat: 'DD/MM/YYYY' },
		{ key: 'updatedDate', label: 'Ng??y c???p nh???t', dateFormat: 'DD/MM/YYYY' },
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
							<TextFieldHookForm name="code" label="M?? t??i s???n" />
							<TextFieldHookForm name="fullName" label="T??n kh??ch h??ng" />
							<PullDownHookForm label="Tr???ng th??i ?????t l???ch" options={handOverBookingStatus} name="bookingStatus" />
							<DatePickerHookForm label="T??? ng??y" name="from" />
							<DatePickerHookForm label="?????n ng??y" name="to" />
							<Flex align="end" justify="end">
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									T??m ki???m
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
						Danh s??ch ?????t l???ch b??n giao
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWidth={2000}
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
