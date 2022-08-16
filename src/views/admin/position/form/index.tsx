import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Box, Button, Checkbox, FormControl, FormLabel, Heading, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useHistory } from 'react-router-dom';
import { createRole, getRoleById, updateRole } from 'services/role';
import { FeatureModuleKey, IRolePayload, PermistionActionkey } from 'services/role/type';
import { Status, statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
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
	checked?: Array<PermistionActionkey>;
	permistion: Array<PermistionActionkey>;
	isDisabled?: boolean;
}
interface PermissionRef {
	submit: () => { actions: Array<PermistionActionkey>; feature: FeatureModuleKey };
	reset: () => void;
}

const Permistion = forwardRef<PermissionRef, PermissionProps>(
	({ title, id, value, checked, permistion, isDisabled = false }, ref) => {
		const [isChecked, setIsChecked] = useState<Array<PermistionActionkey>>(checked || []);
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

		const handleChange = (i: PermistionActionkey) => {
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
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '2',
		value: 'ORGANIZATIONS_MANAGEMENT',
		title: 'Quản lý sơ đồ tổ chức',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '3',
		value: 'ROLE_MANAGEMENT',
		title: 'Quản lý chức vụ',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '4',
		value: 'AREA_MANAGEMENT',
		title: 'Quản lý phân khu',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '5',
		value: 'PROPERTIES_MANAGEMENT',
		title: 'Quản lý căn hộ',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '6',
		value: 'RESIDENT_CARD_MANAGEMENT',
		title: 'Quản lý thẻ cư dân',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '7',
		value: 'RESIDENT_MANAGEMENT',
		title: 'Quản lý cư dân',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '8',
		value: 'FACILITY_GROUP_MANAGEMENT',
		title: 'Quản lý loại tiện ích',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '9',
		value: 'FACILITY_MANAGEMENT',
		title: 'Quản lý tiện ích',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '10',
		value: 'FACILITY_BOOKING_MANAGEMENT',
		title: 'Quản lý đăng kí tiện ích',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
	{
		id: '11',
		value: 'ARTICLE_MANAGEMENT',
		title: 'Quản lý bài viết',
		permistion: ['ADD', 'UPDATE', 'DELETE'],
	},
];

const DetailPosition: React.FC = () => {
	const checkBoxRef = useRef<Array<PermissionRef | null>>([]);

	const [defaultPermission, setPermission] = useState<Array<PermissionProps>>(permissions);

	const { toast } = useToastInstance();
	const { changeAction, action, id } = useActionPage();
	const [loading, setLoading] = useState(true);
	const mutationCreate = useMutation(createRole);
	const mutationUpdate = useMutation(updateRole);
	const {
		data: detailData,
		isFetched,
		isError,
		refetch,
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
			await mutationCreate.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
			checkBoxRef.current.forEach(i => i?.reset());
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: Omit<IRolePayload, 'id'>) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật thành công' });
			refetch();
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const d = defaultPermission.map((_, idx) => checkBoxRef.current[idx]?.submit());

		const prepareData = {
			...data,
			privilegeRequests: d.filter(i => i !== undefined) as {
				actions: Array<PermistionActionkey>;
				feature: FeatureModuleKey;
			}[],
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create'
			? handelCreate(prepareData, reset)
			: handelUpdate({ ...prepareData, state: prepareData.state?.value as Status });
	};

	const history = useHistory();

	if (loading && !!id && (isError || !isFetched)) return null;

	const defaultValues = { ...detailData?.data, state: statusOption2.find(i => i.value === detailData?.data?.state) };
	const isDisable = action === 'detail';

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
						<TextFieldHookForm label="Mã chức vụ" isDisabled={isDisable} name="code" variant="admin" />
					</Stack>
					{action !== 'create' && (
						<Stack pb={3} align="start" w={{ sm: '100%', md: '50%' }}>
							<PullDowndHookForm
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
						{action === 'detail' && (
							<Button type="button" onClick={() => changeAction('edit', id || '', false)} variant="brand">
								Chỉnh sửa
							</Button>
						)}
						<Button w="20" disabled={action === 'detail'} type="submit" variant="brand">
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
export default DetailPosition;
