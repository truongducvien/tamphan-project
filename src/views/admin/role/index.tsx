import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdLibraryAdd } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { getRole } from 'src/services/role';
import { IRole, IRoleParams } from 'src/services/role/type';
import { PermistionAction } from 'src/variables/permission';
import { statusOption2 } from 'src/variables/status';

type DaraForm = Omit<IRoleParams, 'page' | 'size'>;

const RoleManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { actions, permistionAction } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [params, setParams] = useState<DaraForm>({});

	const { data, isLoading } = useQuery(
		['listRole', params, currentPage, pageSize],
		() => getRole({ page: currentPage - 1, size: pageSize, ...params }),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IRole>> = [
		{ key: 'name', label: 'Tên chức vụ' },
		{ key: 'code', label: 'Mã chức vụ' },
		{ key: 'createdDate', label: 'Ngày tạo', dateFormat: 'DD/MM/YYYY' },
		{ key: 'updatedDate', label: 'Ngày cập nhật', dateFormat: 'DD/MM/YYYY' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const onSearch = (payload: DaraForm) => {
		resetPage();
		setParams(payload);
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
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
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={actions.filter(i => [PermistionAction.UPDATE, PermistionAction.VIEW].some(ii => ii === i))}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default RoleManagement;
