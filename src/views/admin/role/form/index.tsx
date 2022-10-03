import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Box, Button, Checkbox, FormControl, FormLabel, Heading, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Loading } from 'src/components/form/Loading';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { createRole, getRoleById, updateRole } from 'src/services/role';
import { FeatureModuleKey, IRolePayload, PermistionActionKey } from 'src/services/role/type';
import { Status, statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên chức vụ'),
	code: Yup.string().required('Vui lòng nhập mã chức vụ'),
	status: Yup.object().shape({ label: Yup.string(), value: Yup.string() }),
});

interface DataForm {
	name: string;
	code: string;
	state?: Option;
}

interface PermissionProps {
	id: string;
	title: string;
	value: FeatureModuleKey;
	checked?: Array<PermistionActionKey>;
	permistion: Array<PermistionActionKey>;
	isDisabled?: boolean;
}
interface PermissionRef {
	submit: () => { actions: Array<PermistionActionKey>; feature: FeatureModuleKey };
	reset: () => void;
}

const Permistion = forwardRef<PermissionRef, PermissionProps>(
	({ title, id, value, checked, permistion, isDisabled = false }, ref) => {
		const [isChecked, setIsChecked] = useState<Array<PermistionActionKey>>(checked || []);
		useImperativeHandle(
			ref,
			() => ({
				submit: () => {
					return {
						actions: isChecked,
						feature: value,
					};
				},
				reset: () => {
					setIsChecked([]);
				},
			}),
			[isChecked, value],
		);

		useEffect(() => {
			if (checked) setIsChecked(checked);
		}, [checked]);

		const handleChange = (i: PermistionActionKey) => {
			if (isChecked.includes(i)) setIsChecked(prev => prev.filter(item => item !== i));
			else setIsChecked(prev => [...prev, i]);
		};

		return (
			<Box display="inline-grid">
				<FormControl>
					<FormLabel htmlFor={id}>{title}</FormLabel>
					{permistion.map(i => {
						return (
							<Box key={i}>
								<Checkbox
									isDisabled={isDisabled}
									variant="admin"
									id={id}
									onChange={_ => handleChange(i)}
									isChecked={isChecked.includes(i)}
									ml={5}
								>
									{i.toLowerCase()}
								</Checkbox>
							</Box>
						);
					})}
				</FormControl>
			</Box>
		);
	},
);

const permissions: Array<PermissionProps> = [
	{
		id: '1',
		value: 'OPERATION_MANAGEMENT',
		title: 'Quản lý người dùng',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '2',
		value: 'ORGANIZATIONS_MANAGEMENT',
		title: 'Quản lý đơn vị',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '3',
		value: 'ROLE_MANAGEMENT',
		title: 'Quản lý chức vụ',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '4',
		value: 'AREA_MANAGEMENT',
		title: 'Quản lý phân khu',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '5',
		value: 'PROPERTIES_MANAGEMENT',
		title: 'Quản lý căn hộ',
		permistion: ['VIEW', 'ADD', 'UPDATE', 'IMPORT'],
	},
	{
		id: '6',
		value: 'RESIDENT_MANAGEMENT',
		title: 'Quản lý cư dân',
		permistion: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'IMPORT'],
	},
	{
		id: '7',
		value: 'RESIDENT_CARD_MANAGEMENT',
		title: 'Quản lý thẻ cư dân',
		permistion: ['VIEW', 'DELETE', 'IMPORT'],
	},
	{
		id: '8',
		value: 'RESIDENT_CARD_REQUEST_MANAGEMENT',
		title: 'Quản lý yêu cầu thẻ cư dân',
		permistion: ['VIEW'],
	},
	{
		id: '9',
		value: 'RESIDENT_CARD_PROCESS_MANAGEMENT',
		title: 'Phê duyệt yêu cầu cấp thẻ',
		permistion: ['APPROVE', 'REJECT'],
	},
	{
		id: '10',
		value: 'FACILITY_GROUP_MANAGEMENT',
		title: 'Quản lý loại tiện ích',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '11',
		value: 'FACILITY_MANAGEMENT',
		title: 'Quản lý tiện ích',
		permistion: ['VIEW', 'ADD', 'UPDATE'],
	},
	{
		id: '12',
		value: 'FACILITY_BOOKING_MANAGEMENT',
		title: 'Quản lý đăng kí tiện ích',
		permistion: ['VIEW', 'UPDATE'],
	},
	{
		id: '13',
		value: 'ARTICLE_MANAGEMENT',
		title: 'Quản lý bài viết',
		permistion: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'PUBLISH'],
	},
	{
		id: '14',
		value: 'HANOVER_MANAGEMENT',
		title: 'Quản lý tài sản bàn giao',
		permistion: ['VIEW', 'IMPORT', 'DELETE'],
	},
	{
		id: '15',
		value: 'HANOVER_BOOKING_MANAGEMENT',
		title: 'Quản lý lịch bàn giao',
		permistion: ['VIEW', 'UPDATE'],
	},
];

const DetailPosition: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const checkBoxRef = useRef<Array<PermissionRef | null>>([]);
	const [defaultPermission, setPermission] = useState<Array<PermissionProps>>(permissions);

	const { toast } = useToastInstance();
	const { changeAction, action, id, goback } = useActionPage();
	const [loading, setLoading] = useState(true);
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createRole);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateRole);
	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getRoleById(id || ''), {
		enabled: !!id,
		onSuccess: ({ data }) => {
			const d = permissions.map(i => ({ ...i, checked: data?.privileges?.[i.value] }));
			setPermission(d);
			setLoading(false);
		},
	});

	const handelCreate = async (data: Omit<IRolePayload, 'id' | 'state'>, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			goback();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: Omit<IRolePayload, 'id'>) => {
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
		const d = defaultPermission.map((_, idx) => checkBoxRef.current[idx]?.submit());

		const prepareData = {
			...data,
			privilegeRequests: d.filter(i => i !== undefined) as {
				actions: Array<PermistionActionKey>;
				feature: FeatureModuleKey;
			}[],
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create'
			? handelCreate(prepareData, reset)
			: handelUpdate({ ...prepareData, state: prepareData.state?.value as Status });
	};

	const history = useHistory();

	if (loading && !!id && (isError || !isFetched || isLoading)) return <Loading />;

	const defaultValues = { ...detailData?.data, state: statusOption2.find(i => i.value === detailData?.data?.state) };
	const isDisable = action === 'detail';

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={defaultValues as unknown as { [x: string]: string }}
				>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isRequired isDisabled={isDisable} label="Tên chức vụ" name="name" variant="admin" />
						<TextFieldHookForm label="Mã chức vụ" isRequired isDisabled={isDisable} name="code" variant="admin" />
					</Stack>
					{action !== 'create' && (
						<Stack pb={3} align="start" w={{ sm: '100%', md: '50%' }}>
							<PullDownHookForm
								isDisabled={isDisable}
								label="Trạng thái"
								name="state"
								isRequired
								options={statusOption2}
							/>
						</Stack>
					)}

					<Heading as="h6" variant="admin" size="sm">
						Chọn quyền:
					</Heading>
					<SimpleGrid p={5} columns={{ sm: 2, md: 3 }} spacing={3}>
						{defaultPermission.map((i, idx) => (
							<Permistion
								key={i.id}
								{...i}
								isDisabled={isDisable}
								ref={ref => {
									checkBoxRef.current[idx] = ref;
								}}
							/>
						))}
					</SimpleGrid>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							type="button"
							hidden={!permistionAction.UPDATE || action !== 'detail'}
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
export default DetailPosition;
