import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import UploadImage from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import dayjs from 'helpers/dayjs';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	phone: Yup.string().required('Vui lòng nhaapj SDT'),
});

interface DataForm {
	name: string;
	phone: string;
	type: string;
	email: string;
	area: string;
	position: string;
	createAt: string;
	map: string;
}

const DetailSubdivision: React.FC = () => {
	const onSubmit = (data: DataForm) => {
		console.log(data);
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
						<TextFieldHookForm isRequired label="Tên phân khu" name="name" variant="admin" />
						<TextFieldHookForm label="Điện thoại liên hệ" name="phone" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column-reverse', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Loại hình BDS"
							name="type"
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
						<TextFieldHookForm isRequired label="Email" name="email" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column-reverse', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isRequired label="Diện tích" name="area" variant="admin" />
						<TextFieldHookForm label="Vị trí" name="posision" variant="admin" />
					</Stack>
					<Box pb={3}>
						<TextFieldHookForm
							isRequired
							label="Ngày cập nhật"
							name="createAt"
							defaultValue={dayjs().format('DD/MM/YYYY')}
							isDisabled
							variant="admin"
						/>
					</Box>
					<Box pb={3} maxW={{ sm: '100%', md: '50%' }}>
						<FormControl>
							<FormLabel>Bản đồ</FormLabel>
							<UploadImage />
						</FormControl>
					</Box>
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
export default DetailSubdivision;
