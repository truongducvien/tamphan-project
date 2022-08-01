import { Box, Button, Heading, HStack, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
});

interface DataForm {
	code: string;
	name: string;
	type: string;
	floor: string;
	block: string;
	subdivision: string;
	area: string;
	countBed: string;
	areaAva: string;
	address: string;
	countBath: string;
	countFoor: string;
	location: string;
	maxPe: string;
	description: string;
	currentPe: string;
	//
	fullname: string;
	gender: string;
	birthday: string;
	phone: string;
	email: string;
	cmnd: string;
	currentAddress: string;
	datecmd: string;
	Caddress: string;
	addressCmnd: string;
}

const AparmentForm: React.FC = () => {
	const onSubmit = (data: DataForm) => {};

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
						<TextFieldHookForm isRequired label="Mã căn hộ" name="code" variant="admin" />
						<TextFieldHookForm label="Tên căn hộ" name="name" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Loại căn hộ"
							name="type"
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isSearchable={false}
						/>
						<PullDowndHookForm
							label="Tình trạng xây dựng"
							name="status"
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isSearchable={false}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="number" label="Tầng" name="floor" variant="admin" />
						<TextFieldHookForm type="number" label="Block" name="block" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Phân khu"
							name="subdivistion"
							options={[
								{
									label: 'a',
									value: '1',
								},
							]}
							isSearchable={false}
						/>
						<TextFieldHookForm type="number" label="Diện tích đất" name="area" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="number" label="Số phòng ngủ" name="countBed" variant="admin" />
						<TextFieldHookForm type="number" label="Diện tích sử dụng" name="areaAva" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="number" label="Địa chỉ" name="address" variant="admin" />
						<TextFieldHookForm type="number" label="Số phòng tắm" name="countBath" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="number" label="Số tầng" name="countFloor" variant="admin" />
						<TextFieldHookForm type="text" label="Hướng" name="location" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="number" label="Số lượng cư dân tối đa" name="countPe" variant="admin" />
						<TextAreaFieldHookForm label="Mô tả" name="description" variant="admin" />
					</Stack>
					<Heading variant="admin" my="3" as="h6" size="md">
						Thông tin chủ sở hữu
					</Heading>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="text" label="Họ và tên" name="fullName" variant="admin" />
						<PullDowndHookForm
							label="Giới tính"
							name="gender"
							options={[
								{
									label: 'Nam',
									value: 'nam',
								},
								{
									label: 'Nữ',
									value: 'nữ',
								},
							]}
							isSearchable={false}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="text" label="Ngày sinh" name="birthday" variant="admin" />
						<TextFieldHookForm type="number" label="Số điện thoại" name="phone" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="email" label="Email" name="email" variant="admin" />
						<TextFieldHookForm type="number" label="CMND/CCCD/Hộ chiếu" name="cmnd" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="text" label="Địa chỉ thường trú" name="address" variant="admin" />
						<TextFieldHookForm type="text" label="Ngày cấp" name="datecmd" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm type="text" label="Địa chỉ tạm trú" name="currentAddress" variant="admin" />
						<TextFieldHookForm type="text" label="Nơi cấp" name="addressCmnd" variant="admin" />
					</Stack>
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
export default AparmentForm;
