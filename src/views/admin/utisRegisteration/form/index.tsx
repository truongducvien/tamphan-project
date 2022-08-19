import { useState } from 'react';

import { Box, Button, HStack, Stack, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AlertDialog from 'components/alertDialog';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { PullDown } from 'components/pulldown';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useHistory } from 'react-router-dom';
import { confirmUtilsReById, getUtilsReById } from 'services/utilsRegisteration';
import { PaymentMethod, paymentMethods, statusUtilsRe } from 'services/utilsRegisteration/type';

const UtilsReForm: React.FC = () => {
	const history = useHistory();
	const { toast } = useToastInstance();
	const { id } = useActionPage();
	const [paymentMethod, setPay] = useState<PaymentMethod>();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data, isFetched, refetch } = useQuery(['detail', id], () => getUtilsReById(id || ''));
	const mutationDelete = useMutation(confirmUtilsReById);

	const onSubmit = () => {
		onOpen();
	};

	const onConfirm = async () => {
		try {
			if (!id && !paymentMethod) return;
			await mutationDelete.mutateAsync({ id: id || '', paymentMethod: paymentMethod || '' });
			toast({ title: 'Cập nhật phương thức thanh toán thành công' });
			onClose();
			refetch();
		} catch {
			toast({ title: 'Cập nhật phương thức thanh toán thất bại', status: 'error' });
		}
	};

	const defaultData = {
		...data?.data,
		bookingTimeSlot: `${data?.data?.bookingTimeSlot.start || ''}-${data?.data?.bookingTimeSlot.end || ''}`,
		paymentMethod: paymentMethods.find(i => i.value === data?.data?.paymentMethod)?.label,
		status: statusUtilsRe.find(i => i.value === data?.data?.status)?.label,
	};

	if (!isFetched) return null;
	// bookingCode
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer onSubmit={onSubmit} defaultValues={defaultData as unknown as { [x: string]: string }}>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Tên tiện ích" name="facilityName" variant="admin" />
						<TextFieldHookForm isDisabled label="Mã đặt chỗ" name="bookingCode" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Tên người đặt" name="userName" variant="admin" />
						<TextFieldHookForm isDisabled label="Ngày dặt chỗ" name="reservationDate" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Số điện thoại" name="phoneNumber" variant="admin" />
						<TextFieldHookForm isDisabled label="Giờ đặt chỗ" name="bookingTimeSlot" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Email" name="email" variant="admin" />
						<TextFieldHookForm isDisabled label="Sô lượng" name="quantityOfPerson" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Trạng thái" name="status" variant="admin" />
						<TextFieldHookForm isDisabled label="Số tiền đặt cọc" name="depositAmount" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Ngày thanh toán" name="datePay" variant="admin" />
						<TextFieldHookForm isDisabled label="Ngày đăng ký" name="reservationDate" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Phương thức thanh toán" name="paymentMethod" variant="admin" />
						<TextFieldHookForm isDisabled label="Ngày huỷ" name="cancelDate" variant="admin" />
					</Stack>
					<Box maxW={{ base: '100%', md: '50%' }}>
						<TextAreaFieldHookForm isDisabled label="Ghi chú" name="note" variant="admin" />
					</Box>
					<HStack pt={3} justify="end">
						<Button type="submit" variant="brand">
							Xác nhận thanh toán cọc
						</Button>
						<Button w="20" type="button" variant="gray" onClick={() => history.goBack()}>
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
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onConfirm={onConfirm}
				body={<PullDown name="pay" onChange={opt => setPay(opt.value as PaymentMethod)} options={paymentMethods} />}
			/>
		</Box>
	);
};
export default UtilsReForm;
