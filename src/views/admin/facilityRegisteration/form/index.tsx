import { useState } from 'react';

import { Box, Button, HStack, Stack, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import AlertDialog from 'components/alertDialog';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { PullDown } from 'components/pulldown';
import { useToastInstance } from 'components/toast';
import { currency } from 'helpers/currency';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { useHistory } from 'react-router-dom';
import { confirmFacilityReById, getFacilityReById } from 'services/facilityRegisteration';
import { PaymentMethod, paymentMethods, statusFacilityRe, StatusFacilityRe } from 'services/facilityRegisteration/type';

const FacilityReForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const history = useHistory();
	const { toast } = useToastInstance();
	const { id } = useActionPage();
	const [paymentMethod, setPay] = useState<PaymentMethod>();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { data, isLoading, refetch, isFetching } = useQuery(['detail', id], () => getFacilityReById(id || ''));
	const mutationDelete = useMutation(confirmFacilityReById);

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

	if (isLoading || isFetching) return <Loading />;

	const defaultData = {
		...data?.data,
		bookingTimeSlot: `${data?.data?.bookingTimeSlot.start || ''}-${data?.data?.bookingTimeSlot.end || ''}`,
		paymentMethod: paymentMethods.find(i => i.value === data?.data?.paymentMethod)?.label,
		status: statusFacilityRe.find(i => i.value === data?.data?.status)?.label,
		depositAmount: currency(data?.data?.depositAmount.amount || 0, data?.data?.depositAmount.currency),
	};

	// bookingCode
	return (
		<Box pt="10px">
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
						<TextFieldHookForm isDisabled label="Ngày sử dụng" name="reservationDate" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled label="Số điện thoại" name="phoneNumber" variant="admin" />
						<TextFieldHookForm isDisabled label="Giờ sử dụng" name="bookingTimeSlot" variant="admin" />
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
						<Button
							type="submit"
							variant="brand"
							hidden={!permistionAction.UPDATE || data?.data?.status !== StatusFacilityRe.PAYMENT_WAITING}
						>
							Xác nhận thanh toán cọc
						</Button>
						<Button type="button" variant="gray" onClick={() => history.goBack()}>
							Quay lại
						</Button>
					</HStack>
				</FormContainer>
			</Card>
			<AlertDialog
				centerTitle
				title="Chọn phương thức thanh toán"
				type="error"
				isOpen={isOpen}
				onClose={onClose}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onConfirm={onConfirm}
				body={
					<PullDown
						name="pay"
						menuPortalTarget={false}
						onChange={opt => setPay(opt.value as PaymentMethod)}
						options={paymentMethods}
					/>
				}
			/>
		</Box>
	);
};
export default FacilityReForm;
