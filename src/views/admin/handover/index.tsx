import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdLibraryBooks } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import importTemplate from 'src/assets/templates/handover-template.csv';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { DownloadTemplate, ImportButton } from 'src/components/importButton';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { getHandover, importHandover, removeHandover } from 'src/services/handover';
import {
	handOverBookingStatus,
	HandOverBookingStatusKey,
	IHandover,
	IHandoverParams,
} from 'src/services/handover/type';
import { StatusProperty, statusProperty } from 'src/services/properties/type';
import { PermistionAction } from 'src/variables/permission';

interface Form {
	code?: string;
	fullName?: string;
	status?: BaseOption<StatusProperty>;
	bookingStatus?: BaseOption<HandOverBookingStatusKey>;
}

const HandoverManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [params, setParams] = useState<IHandoverParams>({});
	const { data, isLoading, refetch } = useQuery(
		['listHandover', params, currentPage, pageSize],
		() =>
			getHandover({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);
	const history = useHistory();
	const { mutateAsync: deleteAsync, isLoading: isDeleting } = useMutation(removeHandover);
	const { mutateAsync: importAsync, isLoading: isImporting } = useMutation(importHandover);
	const { toast } = useToastInstance();

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
			key: 'bookingStatus',
			label: 'Trạng thái đặt lịch',
			tag: ({ bookingStatus }) => handOverBookingStatus.find(i => i.value === bookingStatus),
		},
		{ key: 'createdDate', label: 'Ngày tạo', dateFormat: 'DD/MM/YYYY' },
		{ key: 'updatedDate', label: 'Ngày cập nhật', dateFormat: 'DD/MM/YYYY' },
	];

	const handleSearch = (payload: Form) => {
		resetPage();
		setParams({
			...payload,
			bookingStatus: payload.bookingStatus?.value,
			status: payload.status?.value,
		});
	};

	const handleDelete = async (row: IHandover) => {
		try {
			const next = await alert({
				type: 'error',
				title: 'Bạn có muốn xoá mã tài sản ?',
				description: row.property.code,
			});
			if (!next) return;
			await deleteAsync(row.id);
			toast({ title: 'Xoá thành công' });
			refetch();
		} catch {
			toast({ title: 'Xoá thất bại', status: 'error' });
		}
	};

	const handleImport = async (file: File) => {
		const payload = new FormData();
		payload.append('file', file);
		payload.append('type', 'CSV');
		try {
			await importAsync(payload);
			toast({ title: 'Import thành công' });
			refetch();
		} catch {
			toast({ title: 'Import thất bại', status: 'error' });
		}
	};
	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={handleSearch}>
						<SimpleGrid spacing={3} columns={{ base: 1, md: 4 }} mb={3}>
							<TextFieldHookForm name="code" label="Mã tài sản" />
							<TextFieldHookForm name="fullName" label="Tên khách hàng" />
							<PullDownHookForm label="Trạng thái tài sản" options={statusProperty} name="status" />
							<PullDownHookForm label="Trạng thái đặt lịch" options={handOverBookingStatus} name="bookingStatus" />
						</SimpleGrid>
						<Flex align="end" justify="end">
							<Box hidden={!permistionAction.IMPORT}>
								<DownloadTemplate url={importTemplate} mr={3} />
								{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
								<ImportButton onChangeFile={handleImport} mr={3} isLoading={isImporting} />
							</Box>
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button
								marginLeft={1}
								// hidden={!permistionAction.ADD}
								onClick={() => history.push('/admin/handover/booking')}
								variant="brand"
								leftIcon={<MdLibraryBooks />}
							>
								Danh sách đặt lịch
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
					minWidth={1500}
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading || isDeleting || isImporting}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={actions.filter(i => [PermistionAction.DELETE].some(ii => ii === i))}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={row => handleDelete(row)}
				/>
			</Card>
		</Box>
	);
};

export default HandoverManagement;
