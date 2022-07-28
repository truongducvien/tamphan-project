import { forwardRef, useImperativeHandle, useRef } from 'react';

import { Box, Button, Checkbox, FormControl, FormLabel, Heading, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { PermistionAction } from 'variables/permission';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
});

interface DataForm {
	name: string;
	code: string;
	status: string;
}

interface PermissionProps {
	id: string;
	title: string;
	checked?: Array<PermistionAction>;
	permistion: Array<PermistionAction>;
}
interface PermissionRef {
	submit: () => { id: string; value: Array<PermistionAction> };
}

const Permistion = forwardRef<PermissionRef, PermissionProps>(({ title, id, checked, permistion }, ref) => {
	const checkBoxRef = useRef<Array<HTMLInputElement | null>>([]);

	useImperativeHandle(
		ref,
		() => ({
			submit: () => {
				return {
					id,
					value: checkBoxRef.current.filter(i => i?.checked === true).map(i => i?.value as PermistionAction),
				};
			},
		}),
		[id],
	);
	return (
		<Box display="inline-grid">
			<FormControl>
				<FormLabel htmlFor={id}>{title}</FormLabel>
				{permistion.map((i, idx) => (
					<Box>
						<Checkbox
							variant="admin"
							ref={r => {
								checkBoxRef.current[idx] = r;
							}}
							value={i}
							id={id}
							defaultChecked={!!checked?.includes(i)}
							ml={5}
						>
							{i}
						</Checkbox>
					</Box>
				))}
			</FormControl>
		</Box>
	);
});
const DetailPosition: React.FC = () => {
	const checkBoxRef = useRef<Array<PermissionRef | null>>([]);

	const permissions: Array<PermissionProps> = [
		{
			id: '1',
			title: 'Quản lí người dùng',
			permistion: [PermistionAction.CREATE, PermistionAction.EDIT, PermistionAction.DETETE],
		},
		{
			id: '2',
			title: 'Quản lí sơ đồ tổ chức',
			permistion: [PermistionAction.CREATE, PermistionAction.EDIT, PermistionAction.DETETE],
		},
		{
			id: '3',
			title: 'Quản lí chức vụ',
			checked: [PermistionAction.CREATE],
			permistion: [PermistionAction.CREATE, PermistionAction.EDIT, PermistionAction.DETETE],
		},
	];

	const onSubmit = (data: DataForm) => {
		const d = permissions.map((_, idx) => checkBoxRef?.current?.[idx]?.submit());
		console.log(data, d);
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer onSubmit={onSubmit} validationSchema={validationSchema}>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column-reverse', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isRequired label="Tên chức vụ" name="name" variant="admin" />
						<PullDowndHookForm
							label="Trạng thái"
							name="status"
							isRequired
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
					</Stack>
					<Stack pb={3} align="start">
						<TextFieldHookForm w={{ sm: '100%', md: '50%' }} label="Mã chức vụ" name="code" variant="admin" />
					</Stack>
					<Heading as="h6" variant="admin" size="sm">
						Chọn quyền:
					</Heading>
					<SimpleGrid p={5} columns={{ sm: 2, md: 3 }} spacing={3}>
						{permissions.map((i, idx) => (
							<Permistion
								ref={ref => {
									checkBoxRef.current[idx] = ref;
								}}
								{...i}
							/>
						))}
					</SimpleGrid>
					<HStack pb={3}>
						<Button w="20" type="submit" variant="brand">
							Lưu
						</Button>
						<Button w="20" type="button" variant="gray">
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default DetailPosition;
