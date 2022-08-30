import { useState } from 'react';

import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerdHookForm } from 'components/form/DatePicker';
import { Loading } from 'components/form/Loading';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useHistory } from 'react-router-dom';
import { getAllOffice } from 'services/office';
import { Gender, gender } from 'services/resident/type';
import { getRole } from 'services/role';
import { createUser, getUserById, updateUser } from 'services/user';
import { IUserPayload } from 'services/user/type';
import { Status, statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	username: Yup.string().email('Định dạng là email').required('Vui lòng nhập tên tài khoản'),
	fullName: Yup.string().required('Vui lòng nhập tên họ tên'),
	organizationId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn đơn vị') }),
	roleId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn vai trò') }),
	state: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

interface DataForm extends Omit<IUserPayload, 'gender' | 'organizationId' | 'roleId' | 'state'> {
	gender: Option;
	organizationId: Option;
	roleId: Option;
	state: Option;
}

const UserForm: React.FC = () => {
	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const [keywordRole, setKeywordRole] = useState('');
	const keywordRoleDebound = useDebounce(keywordRole);

	const { data: dataOffice, isFetched: isFecthedOffice } = useQuery(['listOffice'], getAllOffice);

	const { data: dataRole, isFetched: isFecthedRole } = useQuery(['listRole', keywordRoleDebound], () =>
		getRole({ name: keywordRoleDebound }),
	);

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getUserById(id || ''), {
		enabled: !!id && (isFecthedOffice || isFecthedRole),
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createUser);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateUser);

	const handelCreate = async (data: IUserPayload, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IUserPayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const prepareData = {
			...data,
			organizationId: data.organizationId?.value as string,
			roleId: data.roleId?.value as string,
			gender: data.gender?.value as Gender,
			state: data.state?.value as Status,
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && (!isFetched || isError || isLoading)) return <Loading />;

	const defaultData = {
		...detailData?.data,
		organizationId: dataOffice?.items
			.map(i => ({ label: i.name, value: i.id }))
			.find(i => i.value === detailData?.data?.organizationId),
		roleId: dataRole?.items.map(i => ({ label: i.name, value: i.id })).find(i => i.value === detailData?.data?.roleId),
		gender: gender.find(i => i.value === detailData?.data?.gender),
		state: statusOption2.find(i => i.value === detailData?.data?.state),
	};

	const isDisabled = action === 'detail';

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={defaultData as unknown as { [x: string]: string }}
				>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Tài khoản" name="username" variant="admin" />
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Họ tên" name="fullName" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<DatePickerdHookForm isDisabled={isDisabled} label="Ngày sinh" name="dateOfBirth" variant="admin" />
						<PullDowndHookForm isDisabled={isDisabled} label="Giới tính" options={gender} name="gender" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled={isDisabled}
							isRequired
							label="Số điện thoại"
							name="phoneNumber"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Địa chỉ" name="addrress" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Đơn vị"
							name="organizationId"
							isRequired
							isDisabled={isDisabled}
							options={dataOffice?.items.map(i => ({ label: i.name, value: i.id })) || []}
						/>
						<PullDowndHookForm
							isRequired
							label="Vai trò người dùng"
							name="roleId"
							isDisabled={isDisabled}
							options={dataRole?.items.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordRole}
						/>
					</Stack>
					<Box pb={3} pr={2} w={{ base: '100%', md: '50%' }}>
						<PullDowndHookForm
							isRequired
							label="Trạng thái"
							name="state"
							options={statusOption2}
							isDisabled={isDisabled}
						/>
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						{action === 'detail' && (
							<Button type="button" onClick={() => changeAction('edit', id || '')} variant="brand">
								Chỉnh sửa
							</Button>
						)}
						<Button
							w="20"
							disabled={action === 'detail'}
							type="submit"
							variant="brand"
							isLoading={isCreating || isUpdating}
						>
							Lưu
						</Button>
						<Button w="20" onClick={() => history.goBack()} type="button" variant="gray">
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default UserForm;
