import { useRef } from 'react';

import {
	Box,
	Button,
	HStack,
	Stack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	FormControl,
	FormLabel,
	Input,
	Textarea,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import useEffectWithoutMounted from 'hooks/useEffectWithoutMounted';
import { useForceUpdate } from 'hooks/useForceUpdate';
import { useHistory } from 'react-router-dom';
import { getResidentCardAcept, getResidentCardReject, getResidentCardReqById } from 'services/residentCardReq';
import { statusCardReq, typeCardReq } from 'services/residentCardReq/type';
import { BaseResponeAction } from 'services/type';

const ResdidentCardReqDetail: React.FC = () => {
	const { id } = useActionPage();
	const { toast } = useToastInstance();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenReject, onOpen: onOpenReject, onClose: onCloseReject } = useDisclosure();

	const cardNumberRef = useRef<HTMLInputElement>(null);
	const approvalNoteRef = useRef<HTMLTextAreaElement>(null);
	const approvalNoteRejRef = useRef<HTMLTextAreaElement>(null);

	const {
		data: detailData,
		isFetched,
		isError,
		refetch,
		isRefetching,
	} = useQuery(['detail', id], () => getResidentCardReqById(id || ''), {
		enabled: !!id,
	});
	const update = useForceUpdate();
	const history = useHistory();
	const mutationAcept = useMutation(getResidentCardAcept);
	const mutationReject = useMutation(getResidentCardReject);

	const handleAcept = async () => {
		try {
			await mutationAcept.mutateAsync({
				id: id || '',
				approvalNote: approvalNoteRef.current?.value || '',
				cardNumber: cardNumberRef.current?.value,
			});
			toast({ title: 'Phê duyệt thành công' });
			refetch();
			onClose();
		} catch (err) {
			const error = err as AxiosError<BaseResponeAction>;
			toast({
				title: 'Phê duyệt thất bại',
				status: 'error',
				description: error?.response?.data.code === 'RESIDENT_CARD_REQUEST_PROCESS' ? 'Mã thẻ đã tồn tại' : undefined,
			});
		}
	};

	const handleReject = async () => {
		try {
			await mutationReject.mutateAsync({ id: id || '', approvalNote: approvalNoteRejRef.current?.value || '' });
			toast({ title: 'Từ chối yêu cầu thành công' });
			refetch();
			onCloseReject();
		} catch {
			toast({ title: 'Từ chối yêu cầu thất bại', status: 'error' });
		}
	};

	useEffectWithoutMounted(() => {
		if (!isRefetching) update();
	}, [isRefetching]);

	if (!!id && (!isFetched || isError || isRefetching)) return null;

	const defaultValue = {
		...detailData,
		type: typeCardReq.find(i => i.value === detailData?.type),
		status: statusCardReq.find(i => i.value === detailData?.status),
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer defaultValues={defaultValue as unknown as { [x: string]: string }}>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm options={[]} label="Loại yêu cầu" name="type" isDisabled variant="admin" />
						<TextFieldHookForm label="Mã số thẻ cấp mới" name="newCardNumber" isDisabled variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Mã căn hộ" isDisabled name="propertyCode" variant="admin" />
						<PullDowndHookForm options={[]} label="Trạng thái yêu cầu" isDisabled name="status" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Mã số thẻ yêu cầu" isDisabled name="currentCardNumber" variant="admin" />
						<TextFieldHookForm label="Ngày yêu cầu" isDisabled name="requestedDate" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Người yêu cầu" isDisabled name="requesterName" variant="admin" />
						<TextFieldHookForm
							label="Người phê duyệt"
							visibility={detailData?.status === 'WAITING' ? 'hidden' : 'visible'}
							isDisabled
							name=""
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Số điện thoại" isDisabled name="requesterPhoneNumber" variant="admin" />
						<TextFieldHookForm
							label="Ngày phê duyệt"
							visibility={detailData?.status === 'WAITING' ? 'hidden' : 'visible'}
							isDisabled
							name="approvalDate"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm label="Ghi chú" isDisabled name="note" variant="admin" />
						<TextAreaFieldHookForm
							visibility={detailData?.status === 'WAITING' ? 'hidden' : 'visible'}
							label="Ghi chú phê duyệt"
							isDisabled
							name="approvalNote"
							variant="admin"
						/>
					</Stack>
					<Box w={{ base: '100%', md: '50%' }} pb={3} mr={2}>
						<TextFieldHookForm label="Phí cấp thẻ" isDisabled name="currentCardNumber" variant="admin" />
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							w="20"
							hidden={detailData?.status !== 'WAITING'}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onOpen}
							type="button"
							variant="brand"
						>
							Duyệt
						</Button>
						<Button
							w="20"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onOpenReject}
							hidden={detailData?.status !== 'WAITING'}
							type="button"
							variant="delete"
						>
							Từ chối
						</Button>
						<Button w="20" onClick={() => history.goBack()} type="button" variant="gray">
							Quay lại
						</Button>
					</HStack>
				</FormContainer>
			</Card>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Duyệt yêu cầu thẻ</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl
							hidden={detailData?.type === 'ACTIVE' || detailData?.type === 'INACTIVE' || detailData?.type === 'CANCEL'}
						>
							<FormLabel>Số thẻ cấp mới</FormLabel>
							<Input name="cardNumber" ref={cardNumberRef} variant="admin" />
						</FormControl>
						<FormControl mt={3}>
							<FormLabel>Ghi chú</FormLabel>
							<Textarea name="approvalNote" ref={approvalNoteRef} variant="admin" />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<Button colorScheme="brand" mr={3} onClick={handleAcept}>
							Xác nhận
						</Button>
						<Button w={20} variant="gray" onClick={onClose}>
							Huỷ
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpenReject} onClose={onCloseReject} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Từ chối yêu cầu thẻ</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl mt={3}>
							<FormLabel>Ghi chú</FormLabel>
							<Textarea name="approvalNote" ref={approvalNoteRejRef} variant="admin" />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<Button colorScheme="brand" mr={3} onClick={handleReject}>
							Xác nhận
						</Button>
						<Button w={20} variant="gray" onClick={onCloseReject}>
							Huỷ
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
export default ResdidentCardReqDetail;
