import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { deleteArticle, getArticle } from 'src/services/article';
import { IArticle, StatusArticle, statusArticle, typeArticles } from 'src/services/article/type';

const ArticleManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);

	const { toast } = useToastInstance();
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();
	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');

	const { data, isLoading, refetch } = useQuery(
		['listArticle', keyword, currentPage, pageSize],
		() =>
			getArticle({
				keyword,
				page: currentPage - 1,
				size: pageSize,
			}),
		{ onSuccess: d => dispatchInfo(d) },
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
		{ key: 'createdAt', label: 'Ngày tạo', dateFormat: 'DD/MM/YYYY' },
	];

	const handleDelete = async (row: { id: string; title: string }) => {
		try {
			const next = await alert({
				type: 'error',
				title: 'Bạn có muốn xoá ?',
				description: row.title,
			});
			if (!next) return;
			await mutationDelete.mutateAsync(row.id);
			toast({ title: 'Xoá thành công' });
			refetch();
		} catch {
			toast({ title: 'Xoá thất bại', status: 'error' });
		}
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
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
								onClick={() => {
									setKeyword(keywordRef.current?.value || '');
									resetPage();
								}}
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
					pagination={{ value: currentPage, pageSize, ...pagination }}
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
