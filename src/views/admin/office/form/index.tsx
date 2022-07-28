import { Box, Button, HStack } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import dayjs from 'helpers/dayjs';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	subdivision: Yup.string().required('Vui lòng chọn thương hiệu'),
});

interface DataForm {
	name: string;
	subdivision: string;
	description: string;
}

const Detail: React.FC = () => {
	const onSubmit = (data: DataForm) => {
		console.log(data);
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer onSubmit={onSubmit} validationSchema={validationSchema}>
					<HStack spacing={3} pb={3}>
						<TextFieldHookForm isRequired label="Tên đơn vị" name="name" variant="admin" />
						<PullDowndHookForm
							label="Đơn vị trực thuộc"
							name="subdivision"
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
					</HStack>
					<HStack pb={3} align="start">
						<TextAreaFieldHookForm label="Mô tả" name="description" variant="admin" />
						<TextFieldHookForm
							label="Ngày tạo"
							name="crateAt"
							defaultValue={dayjs().format('DD/MM/YYYY')}
							isDisabled
							variant="admin"
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
export default Detail;
