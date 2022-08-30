import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { MdLibraryAdd } from 'react-icons/md';
import { deleteArticle, getArticle } from 'services/article';
import { IArticle, StatusArticle, statusArticle, typeArticles } from 'services/article/type';

const ArticleManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);

	const { toast } = useToastInstance();
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');

	const { data, isLoading, refetch } = useQuery(['listArticle', keyword, currentPage, currentPageSize], () =>
		getArticle({
			keyword,
			page: currentPage - 1,
			size: currentPageSize,
		}),
	);
	const mutationDelete = useMutation(deleteArticle);

	const COLUMNS: Array<IColumn<IArticle>> = [
		{
			key: 'title',
			label: 'Tiêu đề',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ title, shortContent }) => (
				<>
					<Text fontWeight={700} maxH={50} overflow="hidden">
						{title}
					</Text>
					<Text fontSize={12} textOverflow="ellipsis" maxH={100} overflow="hidden">
						{shortContent}
					</Text>
				</>
			),
		},
		{ key: 'type', label: 'Chuyên mục', tag: ({ type }) => typeArticles.find(i => i.value === type) },
		{ key: 'status', label: 'Trạng thái', tag: ({ status }) => statusArticle.find(i => i.value === status) },
		{ key: 'createdAt', label: 'Ngày tạo', dateFormat: 'YYYY-MM-DD' },
	];

	const handleDelete = async (row: { id: string; title: string }) => {
		try {
			await alert({
				type: 'error',
				title: 'Bạn có muốn xoá ?',
				description: row.title,
			});
			await mutationDelete.mutateAsync(row.id);
			toast({ title: 'Xoá thành công' });
			refetch();
		} catch {
			toast({ title: 'Xoá thất bại', status: 'error' });
		}
	};

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<HStack spacing={5} align="flex-end">
						<FormControl>
							<FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
								<Text>Từ khoá</Text>
							</FormLabel>
							<Input
								ref={keywordRef}
								variant="admin"
								maxW={500}
								fontSize="sm"
								ms={{ base: '0px', md: '0px' }}
								type="email"
								placeholder="Nhập ..."
								size="md"
							/>
						</FormControl>
						<Flex>
							<Button
								variant="lightBrand"
								onClick={() => setKeyword(keywordRef.current?.value || '')}
								leftIcon={<SearchIcon />}
							>
								Tìm kiếm
							</Button>
							<Button
								hidden={!permistionAction.ADD}
								onClick={() => changeAction('create')}
								marginLeft={1}
								variant="brand"
								leftIcon={<MdLibraryAdd />}
							>
								Thêm mới
							</Button>
						</Flex>
					</HStack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách bài viết
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
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
					action={actions}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClickDelete={handleDelete}
					editable={({ status }) => [StatusArticle.WAITING_APPROVE, StatusArticle.DRAFT].includes(status)}
				/>
			</Card>
		</Box>
	);
};

export default ArticleManagement;
