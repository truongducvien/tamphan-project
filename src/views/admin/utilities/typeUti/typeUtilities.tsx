import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import { LazyImage } from 'components/image';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { deleteUtilsGroup, getUtilsGroup } from 'services/utils/group';
import { IUtilsGroup } from 'services/utils/group/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';

const TypeUtilitiesManagement: React.FC = () => {
	const [currentPage] = useState(1);
	const [currentPageSize] = useState<number>(10);
	const keywordRef = useRef<HTMLInputElement>(null);
	const { toast } = useToastInstance();
	const [keyword, setKeyword] = useState('');
	const { data, isLoading, refetch } = useQuery(['listUtilsGroup', keyword, currentPage, currentPageSize], () =>
		getUtilsGroup({ name: keyword, page: currentPage - 1, size: currentPageSize }),
	);
	const { changeAction } = useActionPage();

	const mutationDelete = useMutation(deleteUtilsGroup);
	const onDELETE = async (row: IUtilsGroup) => {
		try {
			await alert({
				type: 'error',
				title: 'Bạn có muốn xoá ?',
				description: row.name,
			});
			await mutationDelete.mutateAsync(row.id);
			toast({ title: 'Xoá thành công' });
			refetch();
		} catch {
			toast({ title: 'Xoá thất bại', status: 'error' });
		}
	};
	const onEdit = (id: string) => {
		changeAction('edit', id);
	};

	const onDetail = (id: string) => {
		changeAction('detail', id);
	};

	const COLUMNS: Array<IColumn<IUtilsGroup>> = [
		{ key: 'name', label: 'Tên loại tiện ích' },
		{ key: 'description', label: 'Mô tả' },
		{
			key: 'imageLink',
			label: 'Hình ảnh',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ imageLink }) => {
				if (!imageLink) return null;
				return <LazyImage src={imageLink} />;
			},
		},
		{ key: 'state', label: 'Trạng thái hoạt động', tag: ({ state }) => statusOption2.find(i => i.value === state) },
		{ key: 'updatedDate', label: 'Ngày cập nhật' },
	];

	// const pageInfo = {
	// 	total: data?.totalItems,
	// 	hasNextPage: data ? currentPage < data?.totalPages : false,
	// 	hasPreviousPage: data ? currentPage > 0 : false,
	// };

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<Stack
						spacing={5}
						align="end"
						justify={{ base: 'center', md: 'left', xl: 'left' }}
						direction={{ base: 'column', md: 'row' }}
					>
						<FormControl flex={0.5}>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Tên loại tiện ích</Text>
							</FormLabel>
							<Input
								ref={keywordRef}
								variant="admin"
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="text"
								placeholder="Nhập ..."
								size="md"
							/>
						</FormControl>
						<Flex flex={1} justifyContent="end">
							<Button
								variant="lightBrand"
								onClick={() => setKeyword(keywordRef.current?.value || '')}
								leftIcon={<SearchIcon />}
							>
								Tìm kiếm
							</Button>
							<Button marginLeft={1} onClick={() => changeAction('create')} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
							<Button marginLeft={1} variant="DELETE" leftIcon={<MdDelete />}>
								Xoá
							</Button>
						</Flex>
					</Stack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách loại tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					loading={isLoading}
					keyField="name"
					columns={COLUMNS}
					data={data?.items || []}
					action={[PermistionAction.UPDATE, PermistionAction.DELETE, PermistionAction.VIEW]}
					// pagination={{
					// 	total: Number(pageInfo?.total || 0),
					// 	pageSize: currentPageSize,
					// 	value: currentPage,
					// 	hasNextPage: pageInfo?.hasNextPage,
					// 	hasPreviousPage: pageInfo?.hasPreviousPage,
					// 	onPageChange: page => setCurrentPage(page),
					// 	onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					// }}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={row => onDELETE(row)}
					onClickEdit={row => onEdit(row.id)}
					onClickDetail={row => onDetail(row.id)}
				/>
			</Card>
		</Box>
	);
};

export default TypeUtilitiesManagement;
