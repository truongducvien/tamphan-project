import { useRef, useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, FormControl, FormLabel, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { MdLibraryAdd } from 'react-icons/md';
import { getArticle } from 'services/article';
import { IArticle, statusArticle, typeArticles } from 'services/article/type';
import { PermistionAction } from 'variables/permission';

const ArticleManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(0);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);
	const keywordRef = useRef<HTMLInputElement>(null);
	const [keyword, setKeyword] = useState('');

	const { data, isLoading } = useQuery(['listArticle', keyword, currentPage, currentPageSize], () =>
		getArticle({
			keyword,
			page: currentPage,
			size: currentPageSize,
		}),
	);

	const COLUMNS: Array<IColumn<IArticle>> = [
		{
			key: 'title',
			label: 'Tiêu đề',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: ({ title, shortContent }) => (
				<>
					<Text fontWeight={700}>{title}</Text>
					<Text fontSize={12} textOverflow="ellipsis">
						{shortContent}
					</Text>
				</>
			),
		},
		{ key: 'type', label: 'Chuyên mục', cell: ({ type }) => typeArticles.find(i => i.value === type)?.label },
		{ key: 'status', label: 'Trạng thái', cell: ({ status }) => statusArticle.find(i => i.value === status)?.label },
		{ key: 'createdAt', label: 'Ngày tạo' },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? data?.pageNum < data?.totalPages : false,
		hasPreviousPage: data ? data?.pageNum < 0 : false,
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
							<Button onClick={() => changeAction('create')} marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Flex>
					</HStack>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách bài viết
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					testId="consignments-dashboard"
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
					action={[PermistionAction.UPDATE, PermistionAction.VIEW]}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default ArticleManagement;
