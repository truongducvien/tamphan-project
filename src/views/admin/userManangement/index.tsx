import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { MdLibraryAdd } from 'react-icons/md';
import { getOffice } from 'services/office';
import { getUser } from 'services/user';
import { IUser, IUserParams } from 'services/user/type';
import { PermistionAction } from 'variables/permission';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	fullName: Yup.string(),
	username: Yup.string(),
	organizationId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const UserManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [keyword, setKeyword] = useState('');
	const deboundKeyword = useDebounce(keyword);
	const [params, setParams] = useState<Omit<IUserParams, 'page' | 'size'>>();

	const { data: dataOffice } = useQuery(['list', deboundKeyword], () => getOffice(deboundKeyword));

	const { data, isLoading, isError } = useQuery(['users', currentPage, currentPageSize, params], () =>
		getUser({ page: currentPage - 1, size: currentPageSize, ...params }),
	);

	const COLUMNS: Array<IColumn<IUser>> = [
		{ key: 'username', label: 'Tài khoản' },
		{ key: 'fullName', label: 'Họ tên' },
		{ key: 'phoneNumber', label: 'Sô điện thoại' },
		{ key: 'roleId', label: 'Vai trò người dùng' },
		{ key: 'organizationName', label: 'Đơn vị' },

		// { key: 'status', label: 'Trạng thái' },
	];

	const pageInfo = {
		total: data?.totalItems,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};
	const handleFillter = (payload: { fullName: string; organizationId: Option; username: string }) => {
		setParams({ ...payload, organizationId: payload.organizationId.value as string });
	};

	const { changeAction } = useActionPage();

	if (isError) return null;

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={handleFillter} validationSchema={validationSchema}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={5}>
							<PullDowndHookForm
								label="Đơn vị"
								isClearable
								isSearchable
								name="organizationId"
								options={dataOffice?.items.map(i => ({ label: i.name, value: i.id })) || []}
								onInputChange={setKeyword}
							/>
							<TextFieldHookForm label="Họ tên" name="fullName" />
							<TextFieldHookForm label="Tài khoản" name="username" />
						</SimpleGrid>
						<Flex mt={3} flex={1} alignItems="flex-end" justifyContent="flex-end">
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								Tìm kiếm
							</Button>
							<Button onClick={() => changeAction('create')} marginLeft={1} variant="brand" leftIcon={<MdLibraryAdd />}>
								Thêm mới
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách người dùng
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
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
					loading={isLoading}
					action={[PermistionAction.UPDATE, PermistionAction.VIEW]}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default UserManagement;
