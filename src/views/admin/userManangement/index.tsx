import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDownHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { MdLibraryAdd } from 'react-icons/md';
import { getAllOrganization } from 'services/organizations';
import { getUser } from 'services/user';
import { IUser, IUserParams } from 'services/user/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	fullName: Yup.string(),
	username: Yup.string(),
	organizationId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const UserManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [params, setParams] = useState<Omit<IUserParams, 'page' | 'size'>>();

	const { data: dataOrganization } = useQuery(['listOrganization'], getAllOrganization);

	const { data, isLoading } = useQuery(['users', currentPage, currentPageSize, params], () =>
		getUser({ page: currentPage - 1, size: currentPageSize, ...params }),
	);

	const COLUMNS: Array<IColumn<IUser>> = [
		{ key: 'username', label: 'Tài khoản' },
		{ key: 'fullName', label: 'Họ tên' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'role', label: 'Vai trò người dùng', cell: ({ role }) => role?.name },
		{ key: 'organizationName', label: 'Đơn vị' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	const handleFillter = (payload: { fullName: string; organizationId: Option; username: string }) => {
		setParams({ ...payload, organizationId: payload.organizationId?.value as string });
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={handleFillter} validationSchema={validationSchema}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={5}>
							<PullDownHookForm
								label="Đơn vị"
								isClearable
								isSearchable
								name="organizationId"
								options={dataOrganization?.items.map(i => ({ label: i.name, value: i.id })) || []}
							/>
							<TextFieldHookForm label="Họ tên" name="fullName" />
							<TextFieldHookForm label="Tài khoản" name="username" />
						</SimpleGrid>
						<Flex mt={3} flex={1} alignItems="flex-end" justifyContent="flex-end">
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
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
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách người dùng
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}

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
					loading={isLoading}
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default UserManagement;
