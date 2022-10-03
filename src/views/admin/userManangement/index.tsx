import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { getAllOrganization } from 'src/services/organizations';
import { getUser } from 'src/services/user';
import { IUser, IUserParams } from 'src/services/user/type';
import { PermistionAction } from 'src/variables/permission';
import { statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	fullName: Yup.string(),
	username: Yup.string(),
	organizationId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const UserManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();
	const [params, setParams] = useState<Omit<IUserParams, 'page' | 'size'>>();

	const { data: dataOrganization } = useQuery(['listOrganization'], getAllOrganization);

	const { data, isLoading } = useQuery(
		['users', currentPage, pageSize, params],
		() => getUser({ page: currentPage - 1, size: pageSize, ...params }),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IUser>> = [
		{ key: 'username', label: 'Tài khoản' },
		{ key: 'fullName', label: 'Họ tên' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'role', label: 'Vai trò người dùng', cell: ({ role }) => role?.name },
		{ key: 'organizationName', label: 'Đơn vị' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const handleFillter = (payload: { fullName: string; organizationId: Option; username: string }) => {
		resetPage();
		setParams({ ...payload, organizationId: payload.organizationId?.value as string });
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
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
					columns={COLUMNS}
					data={data?.items || []}
					pagination={{ value: currentPage, pageSize, ...pagination }}
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
