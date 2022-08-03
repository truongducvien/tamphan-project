import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { CheckboxHookForm } from 'components/form/Checkbox';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	cmnd: Yup.string().required('Vui lòng nhập cmnd'),
});

interface DataForm {
	name: string;
	cmnd: string;
	birthday: string;
	createCm: string;
	gender: string;
	addCm: string;
	partmentCode: string;
	phone: string;
	role: string;
	email: string;
	relaition: string;
	novaid: boolean;
	address: string;
	status: boolean;
	currentAddress: string;
	uyquyen: string;
	createAt: string;
}

const ResidentForm: React.FC = () => {
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
						<TextFieldHookForm isRequired label="Họ và tên" name="name" variant="admin" />
						<TextFieldHookForm isRequired label="CMND.CCCD/Hộ chiếu" name="cmnd" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ngày sinh" name="birthday" variant="admin" />
						<TextFieldHookForm label="Ngày cấp" name="createCm" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Giới tính"
							name="gender"
							isRequired
							options={[
								{
									label: 'Nam',
									value: 'nam',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm label="Nơi cấp" name="addCm" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Căn hộ"
							name="partmentCode"
							isRequired
							options={[
								{
									label: '1',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm label="Số điện thoại" name="phone" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Vai trò"
							name="role"
							isRequired
							options={[
								{
									label: 'Cư dân',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm isRequired label="Email" type="email" name="email" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Mối quan hệ chủ sở hữu"
							name="role"
							isRequired
							options={[
								{
									label: 'Vợ',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm isRequired label="Địa chỉ thường trú" name="address" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Trạng thái hoạt động"
							name="role"
							isRequired
							options={[
								{
									label: 'Đang hoạt động',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm isRequired label="Địa chỉ tạm trú" name="currentAddress" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Trạng thái hoạt động"
							name="role"
							isRequired
							options={[
								{
									label: 'Đang hoạt động',
									value: '1',
								},
							]}
							isMulti
							isSearchable={false}
						/>
						<TextFieldHookForm isRequired label="Địa chỉ tạm trú" name="currentAddress" variant="admin" />
						{/* <CheckboxHookForm label="Cho phép sử dụng NOVAID" name="novaid" variant="admin" /> */}
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isRequired label="Thông tin uỷ quyền" name="uyquyen" variant="admin" />
						<TextFieldHookForm isRequired label="Ngày cập nhật" isDisabled name="createAt" variant="admin" />
					</Stack>
					<Box>
						<CheckboxHookForm label="Cho phép sử dụng NOVAID" name="novaid" variant="admin" />
					</Box>
					<HStack pt={3} justifyContent="end">
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
export default ResidentForm;
