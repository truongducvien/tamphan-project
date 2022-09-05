import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { MdLibraryAdd } from 'react-icons/md';
import { getRole } from 'services/role';
import { IRole, IRoleParams } from 'services/role/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';

type DaraForm = Omit<IRoleParams, 'page' | 'size'>;

const RoleManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { actions, permistionAction } = useActionPermission(request);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const [params, setParams] = useState<DaraForm>({});

	const { data, isLoading } = useQuery(['listRole', params, currentPage, currentPageSize], () =>
		getRole({ page: currentPage - 1, size: currentPageSize, ...params }),
	);

	const COLUMNS: Array<IColumn<IRole>> = [
		{ key: 'name', label: 'Tên chức vụ' },
		{ key: 'code', label: 'Mã chức vụ' },
		{ key: 'createdDate', label: 'Ngày tạo', dateFormat: 'YYYY-MM-DD' },
		{ key: 'updatedDate', label: 'Ngày cập nhật', dateFormat: 'YYYY-MM-DD' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const onSearch = (payload: DaraForm) => {
		setParams(payload);
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
					<FormContainer onSubmit={onSearch}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'left', xl: 'left' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<TextFieldHookForm name="name" label="Tên chức vụ" />
							<TextFieldHookForm label="Mã chức vụ" name="code" />
							<Flex align="center">
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
								<Button
									onClick={() => changeAction('create')}
									marginLeft={1}
									variant="brand"
									hidden={!permistionAction.ADD}
									leftIcon={<MdLibraryAdd />}
								>
									Thêm mới
								</Button>
							</Flex>
						</Stack>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách chức vụ
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					// onSelectionChange={handleSelectionChange}

					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
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
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default RoleManagement;
