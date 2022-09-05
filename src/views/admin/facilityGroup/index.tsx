import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import { LazyImage } from 'components/image';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { MdLibraryAdd } from 'react-icons/md';
import { deleteFacilityGroup, getFacilityGroup } from 'services/facility/group';
import { IFacilityGroup } from 'services/facility/group/type';
import { statusOption2 } from 'variables/status';

const FacilityGroupManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const keywordRef = useRef<HTMLInputElement>(null);
	const { toast } = useToastInstance();
	const [keyword, setKeyword] = useState('');
	const { data, isLoading, refetch } = useQuery(['listFacilityGroup', keyword, currentPage, currentPageSize], () =>
		getFacilityGroup({ name: keyword, page: currentPage - 1, size: currentPageSize }),
	);
	const { changeAction } = useActionPage();

	const mutationDelete = useMutation(deleteFacilityGroup);
	const onDelete = async (row: IFacilityGroup) => {
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

	const COLUMNS: Array<IColumn<IFacilityGroup>> = [
		{ key: 'name', label: 'Tên loại tiện ích' },
		{ key: 'description', label: 'Mô tả' },
		{
			key: 'imageLink',
			label: 'Hình ảnh',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ imageLink }) => {
				if (!imageLink) return null;
				return (
					<Box width={100}>
						<LazyImage src={imageLink} />
					</Box>
				);
			},
		},
		{ key: 'state', label: 'Trạng thái hoạt động', tag: ({ state }) => statusOption2.find(i => i.value === state) },
		{ key: 'updatedDate', label: 'Ngày cập nhật', dateFormat: 'YYYY-MM-DD' },
	];

	const pageInfo = {
		total: data?.totalItems,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

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
							<Button
								hidden={!permistionAction.ADD}
								marginLeft={1}
								onClick={() => changeAction('create')}
								variant="brand"
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</Stack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách loại tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					loading={isLoading}
					minWidth="1500px"
					columns={COLUMNS}
					data={data?.items || []}
					action={actions}
					pagination={{
						total: Number(pageInfo?.total || 0),
						pageSize: currentPageSize,
						value: currentPage,
						hasNextPage: pageInfo?.hasNextPage,
						hasPreviousPage: pageInfo?.hasPreviousPage,
						onPageChange: page => setCurrentPage(page),
						onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					}}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={row => onDelete(row)}
					onClickEdit={row => onEdit(row.id)}
					onClickDetail={row => onDetail(row.id)}
				/>
			</Card>
		</Box>
	);
};

export default FacilityGroupManagement;
