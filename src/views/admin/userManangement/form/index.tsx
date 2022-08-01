import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	account: Yup.string().required('Vui lòng nhập tên nhóm'),
	subdivision: Yup.array().required('Vui lòng chọn thương hiệu').min(1),
});

interface DataForm {
	account: string;
	birthday: string;
	email: string;
	room: string;
	subdivision: string;
	status: string;
	fullName: string;
	gender: string;
	phone: string;
	role: string;
	address: string;
}

const UserForm: React.FC = () => {
	const onSubmit = (data: DataForm) => {
		console.log(data);
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer onSubmit={onSubmit} validationSchema={validationSchema}>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isRequired label="Tài khoản" name="account" variant="admin" />
						<TextFieldHookForm isRequired label="Họ tên" name="fullName" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ngày sinh" name="birthday" variant="admin" />
						<TextFieldHookForm label="Giới tính" name="gender" variant="admin" />
					</Stack>
					<HStack pb={3}>
						<TextFieldHookForm label="Email" name="email" variant="admin" />
						<TextFieldHookForm isRequired label="Sô điện thoại" name="phone" variant="admin" />
					</HStack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Đơn vị"
							name="room"
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
						<PullDowndHookForm
							isRequired
							label="Vai trò người đung"
							name="role"
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
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Phân khu quản lí"
							isRequired
							name="subdivision"
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm label="Đại chỉ" name="addrress" variant="admin" />
					</Stack>
					<HStack pb={3}>
						<PullDowndHookForm
							label="Trạng thái hoạt động"
							name="subdivision"
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
					</HStack>
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
export default UserForm;
