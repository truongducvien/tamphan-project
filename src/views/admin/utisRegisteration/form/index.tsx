import { Box, Button, HStack, Stack, useDisclosure } from '@chakra-ui/react';
import AlertDialog from 'components/alertDialog';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { PullDown } from 'components/pulldown';
import * as Yup from 'yup';

const validationSchema = Yup.object({});

export interface DataForm {
	name: string;
	createAt: string;
	createBy: string;
	time: string;
	phone: string;
	qty: string;
	email: string;
	price: string;
	status: string;
	dateRe: string;
	datePay: string;
	dateCancel: string;
	paymentMe: string;
	note: string;
}
const UtilsReForm: React.FC = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const onSubmit = (data: DataForm) => {
		onOpen();
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
						<TextFieldHookForm
							isDisabled
							defaultValue="Hồ bơi Hawaii"
							label="Tên tiện ích"
							name="name"
							variant="admin"
						/>
						<TextFieldHookForm
							isDisabled
							defaultValue="20/11/2022"
							label="Ngày dặt chỗ"
							name="createAt"
							variant="admin"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled
							defaultValue="20/11/2022"
							label="Tên người đặt"
							name="createBy"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled defaultValue="9:00-10:00" label="Giờ đặt chỗ" name="time" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled
							defaultValue="1231231232"
							label="Số điện thoại"
							name="phone"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled label="Sô lượng" name="qty" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Email" name="email" variant="admin" />
						<TextFieldHookForm isDisabled label="Số tiền đặt cọc" name="price" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Trạng thái" name="status" variant="admin" />
						<TextFieldHookForm isDisabled label="Ngày đăng kí" name="dateRe" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Ngày thanh toán" name="datePay" variant="admin" />
						<TextFieldHookForm isDisabled label="Ngày huỷ" name="dateCancel" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Phương thức thanh toán" name="paymentMe" variant="admin" />
						<TextAreaFieldHookForm isDisabled label="Ghi chú" name="note" variant="admin" />
					</Stack>
					<HStack pt={3} justify="end">
						<Button type="submit" variant="brand">
							Xác nhận thanh toán
						</Button>
						<Button w="20" type="button" variant="gray">
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
			<AlertDialog
				centerTitle
				title="Chọn phương thức thanh toán"
				isOpen={isOpen}
				onClose={onClose}
				onConfirm={onClose}
				body={
					<PullDown
						name="paymentMethot"
						options={[
							{
								label: 'Tiền mặt',
								value: '1',
							},
						]}
					/>
				}
			/>
		</Box>
	);
};
export default UtilsReForm;
