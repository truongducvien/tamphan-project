import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import UploadImage from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { CheckboxHookForm } from 'components/form/Checkbox';
import { DatePickerdHookForm } from 'components/form/DatePicker';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên tiện ích'),
});

export interface DataForm {
	name: string;
	subdivision: string;
	type: string;
	address: string;
	request: string;
	description: string;
	price: string;
	time: string;
	max: string;
	typeTime: string;
	apping: string;
	schedule: string;
	maxCount: string;
	dayOff: string;
	phone: string;
	status: string;
	image: string[];
}
const UtilitiesForm: React.FC = () => {
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
						<TextFieldHookForm isRequired label="Tên tiện ích" name="name" variant="admin" />
						<PullDowndHookForm
							label="Phân khu"
							name="subdivision"
							isRequired
							options={[
								{
									label: 'River Park 1',
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
						<PullDowndHookForm
							label="Loại tiện ích"
							isRequired
							name="type"
							options={[
								{
									label: 'Hồ bơi',
									value: '1',
								},
							]}
							isSearchable={false}
						/>
						<TextFieldHookForm label="Địa chỉ" name="address" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Yêu cầu đặc cọc"
							isRequired
							name="request"
							options={[
								{
									label: 'Có',
									value: '1',
								},
							]}
							isSearchable={false}
						/>
						<TextFieldHookForm label="Số tiền đặc cọc" name="price" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Giờ hoạt động" name="time" variant="admin" />
						<TextFieldHookForm label="Sức chứa" name="max" variant="admin" type="number" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Loại khung giờ sử dụng" name="time" variant="admin" />
						<PullDowndHookForm
							label="Cho phép đặt chỗ qua App"
							name="apping"
							options={[
								{
									label: 'Có',
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
						<TextFieldHookForm label="Khung giờ" name="schedule" variant="admin" />
						<TextFieldHookForm label="Số lượng tối đa cho phép đặt" name="maxCount" type="number" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ngày nghĩ" name="dayOf" variant="admin" />
						<TextFieldHookForm label="Số điện thoại liên hệ" name="phone" type="number" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm label="Mô tả" variant="admin" name="description" />
						<CheckboxHookForm
							pt={{ base: '0px', md: '25px' }}
							label="Trạng thái hoạt động"
							name="status"
							variant="admin"
						/>
					</Stack>
					<Box mb={3}>
						<FormControl>
							<FormLabel>Hình ảnh</FormLabel>
							<UploadImage isMulti />
						</FormControl>
					</Box>
					<HStack pt={3} justify="end">
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
export default UtilitiesForm;
