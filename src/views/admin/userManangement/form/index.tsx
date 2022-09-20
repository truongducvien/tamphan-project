import { useState } from 'react';

import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { Loading } from 'src/components/form/Loading';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { useToastInstance } from 'src/components/toast';
import { formatDate } from 'src/helpers/dayjs';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { getAllOrganization } from 'src/services/organizations';
import { Gender, gender } from 'src/services/resident/type';
import { getRole } from 'src/services/role';
import { BaseResponseAction } from 'src/services/type';
import { createUser, getUserById, updateUser } from 'src/services/user';
import { IUserPayload } from 'src/services/user/type';
import { Status, statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	username: Yup.string().email('Định dạng là email').required('Vui lòng nhập tài khoản'),
	fullName: Yup.string().required('Vui lòng nhập họ tên'),
	organizationId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn đơn vị') }),
	roleId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn vai trò người dùng') }),
	phoneNumber: Yup.string()
		.required('Vui lòng nhập SDT')
		.matches(/^[0-9]\d{9}$/, { message: 'Số điện thoại không hợp lệ' }),
	state: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

interface DataForm extends Omit<IUserPayload, 'gender' | 'organizationId' | 'roleId' | 'state'> {
	gender: Option;
	organizationId: Option;
	roleId: Option;
	state: Option;
}

const UserForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { changeAction, id, action, goback } = useActionPage();
	const { toast } = useToastInstance();

	const [keywordRole, setKeywordRole] = useState('');
	const keywordRoleDebound = useDebounce(keywordRole);

	const { data: dataOrganization, isFetched: isFecthedOrganization } = useQuery(
		['listOrganization'],
		getAllOrganization,
	);

	const { data: dataRole, isFetched: isFecthedRole } = useQuery(['listRole', keywordRoleDebound], () =>
		getRole({ name: keywordRoleDebound }),
	);

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getUserById(id || ''), {
		enabled: !!id && (isFecthedOrganization || isFecthedRole),
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createUser);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateUser);

	const handelCreate = async (data: IUserPayload, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
			goback();
		} catch (error) {
			const err = error as AxiosError<BaseResponseAction>;
			if (err.response?.data?.code === 'DUPLICATE_USER_ID') {
				toast({ title: 'Tên tài khoản đã tồn tại', status: 'error' });
				return;
			}
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IUserPayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
			goback();
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
			dateOfBirth: formatDate(data.dateOfBirth, { type: 'BE' }),
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && (!isFetched || isError || isLoading)) return <Loading />;

	const defaultData = {
		...detailData?.data,
		organizationId: dataOrganization?.items
			.map(i => ({ label: i.name, value: i.id }))
			.find(i => i.value === detailData?.data?.organizationId),
		roleId: { label: detailData?.data?.role?.name, value: detailData?.data?.role?.id },
		gender: gender.find(i => i.value === detailData?.data?.gender),
		state: statusOption2.find(i => i.value === detailData?.data?.state) || statusOption2[0],
		dateOfBirth: formatDate(detailData?.data?.dateOfBirth),
	};

	const isDisabled = action === 'detail';

	return (
		<Box pt="10px">
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
						<TextFieldHookForm
							isDisabled={action !== 'create'}
							isRequired
							label="Tài khoản"
							name="username"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Họ tên" name="fullName" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<DatePickerHookForm isDisabled={isDisabled} label="Ngày sinh" name="dateOfBirth" variant="admin" />
						<PullDownHookForm isDisabled={isDisabled} label="Giới tính" options={gender} name="gender" />
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
						<TextFieldHookForm isDisabled={isDisabled} label="Địa chỉ" name="address" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDownHookForm
							label="Đơn vị"
							name="organizationId"
							isRequired
							isDisabled={isDisabled}
							options={dataOrganization?.items.map(i => ({ label: i.name, value: i.id })) || []}
						/>
						<PullDownHookForm
							isRequired
							label="Vai trò người dùng"
							name="roleId"
							isDisabled={isDisabled}
							options={dataRole?.items.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordRole}
						/>
					</Stack>
					<Box pb={3} pr={2} w={{ base: '100%', md: '50%' }}>
						<PullDownHookForm
							isRequired
							label="Trạng thái"
							name="state"
							options={statusOption2}
							isDisabled={isDisabled}
						/>
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							hidden={!permistionAction.UPDATE || action !== 'detail'}
							type="button"
							onClick={() => changeAction('edit', id || '')}
							variant="brand"
						>
							Chỉnh sửa
						</Button>
						<Button
							w="20"
							disabled={action === 'detail'}
							type="submit"
							variant="brand"
							isLoading={isCreating || isUpdating}
						>
							Lưu
						</Button>
						<Button type="button" variant="gray" onClick={() => history.goBack()}>
							Quay lại
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default UserForm;
