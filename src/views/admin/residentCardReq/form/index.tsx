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
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Loading } from 'src/components/form/Loading';
import { PullDownHookForm } from 'src/components/form/PullDown';
import { TextAreaFieldHookForm } from 'src/components/form/TextAreaField';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { useToastInstance } from 'src/components/toast';
import { formatDate } from 'src/helpers/dayjs';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import useEffectWithoutMounted from 'src/hooks/useEffectWithoutMounted';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { getResidentCardAcept, getResidentCardReject, getResidentCardReqById } from 'src/services/residentCardReq';
import { statusCardReq, typeCardReq } from 'src/services/residentCardReq/type';
import { BaseResponseAction } from 'src/services/type';

const ResdidentCardReqDetail: React.FC<BaseComponentProps> = () => {
	const { permistionAction } = useActionPermission('RESIDENT_CARD_PROCESS_MANAGEMENT');
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
		isLoading,
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
			toast({ title: 'Ph?? duy???t th??nh c??ng' });
			refetch();
			onClose();
		} catch (err) {
			const error = err as AxiosError<BaseResponseAction>;
			toast({
				title: 'Ph?? duy???t th???t b???i',
				status: 'error',
				description: error?.response?.data?.code === 'RESIDENT_CARD_REQUEST_PROCESS' ? 'M?? th??? ???? t???n t???i' : undefined,
			});
		}
	};

	const handleReject = async () => {
		try {
			await mutationReject.mutateAsync({ id: id || '', approvalNote: approvalNoteRejRef.current?.value || '' });
			toast({ title: 'T??? ch???i y??u c???u th??nh c??ng' });
			refetch();
			onCloseReject();
		} catch {
			toast({ title: 'T??? ch???i y??u c???u th???t b???i', status: 'error' });
		}
	};

	useEffectWithoutMounted(() => {
		if (!isRefetching) update();
	}, [isRefetching]);

	if (!!id && (!isFetched || isError || isLoading || isRefetching)) return <Loading />;

	const defaultValue = {
		...detailData,
		type: typeCardReq.find(i => i.value === detailData?.type),
		status: statusCardReq.find(i => i.value === detailData?.status),
		requestedDate: formatDate(detailData?.requestedDate),
		approvalDate: formatDate(detailData?.approvalDate),
	};

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer defaultValues={defaultValue as unknown as { [x: string]: string }}>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDownHookForm options={[]} label="Lo???i y??u c???u" name="type" isDisabled variant="admin" />
						<TextFieldHookForm label="M?? s??? th??? c???p m???i" name="newCardNumber" isDisabled variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="M?? c??n h???" isDisabled name="propertyCode" variant="admin" />
						<PullDownHookForm options={[]} label="Tr???ng th??i y??u c???u" isDisabled name="status" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="M?? s??? th??? y??u c???u" isDisabled name="currentCardNumber" variant="admin" />
						<TextFieldHookForm
							label="Ng??y y??u c???u"
							// value={formatDate(detailData?.requestedDate, { type: 'export' }) || ''}
							isDisabled
							name="requestedDate"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ng?????i y??u c???u" isDisabled name="requesterName" variant="admin" />
						<TextFieldHookForm
							label="Ng?????i ph?? duy???t"
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
						<TextFieldHookForm label="S??? ??i???n tho???i" isDisabled name="requesterPhoneNumber" variant="admin" />
						<TextFieldHookForm
							label="Ng??y ph?? duy???t"
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
						<TextAreaFieldHookForm label="Ghi ch??" isDisabled name="note" variant="admin" />
						<TextAreaFieldHookForm
							visibility={detailData?.status === 'WAITING' ? 'hidden' : 'visible'}
							label="Ghi ch?? ph?? duy???t"
							isDisabled
							name="approvalNote"
							variant="admin"
						/>
					</Stack>
					<Box w={{ base: '100%', md: '50%' }} pb={3} mr={2}>
						<TextFieldHookForm label="Ph?? c???p th???" isDisabled name="currentCardNumber" variant="admin" />
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							w="20"
							hidden={detailData?.status !== 'WAITING' || !permistionAction.APPROVE}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onOpen}
							type="button"
							variant="brand"
						>
							Duy???t
						</Button>
						<Button
							w="20"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onOpenReject}
							hidden={detailData?.status !== 'WAITING' || !permistionAction.REJECT}
							type="button"
							variant="delete"
						>
							T??? ch???i
						</Button>
						<Button w="20" onClick={() => history.goBack()} type="button" variant="gray">
							Quay l???i
						</Button>
					</HStack>
				</FormContainer>
			</Card>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Duy???t y??u c???u th???</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl
							hidden={detailData?.type === 'ACTIVE' || detailData?.type === 'INACTIVE' || detailData?.type === 'CANCEL'}
						>
							<FormLabel>S??? th??? c???p m???i</FormLabel>
							<Input name="cardNumber" ref={cardNumberRef} variant="admin" />
						</FormControl>
						<FormControl mt={3}>
							<FormLabel>Ghi ch??</FormLabel>
							<Textarea name="approvalNote" ref={approvalNoteRef} variant="admin" />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<Button colorScheme="brand" mr={3} onClick={handleAcept}>
							X??c nh???n
						</Button>
						<Button w={20} variant="gray" onClick={onClose}>
							Hu???
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpenReject} onClose={onCloseReject} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">T??? ch???i y??u c???u th???</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl mt={3}>
							<FormLabel>Ghi ch??</FormLabel>
							<Textarea name="approvalNote" ref={approvalNoteRejRef} variant="admin" />
						</FormControl>
					</ModalBody>
					<ModalFooter>
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<Button colorScheme="brand" mr={3} onClick={handleReject}>
							X??c nh???n
						</Button>
						<Button w={20} variant="gray" onClick={onCloseReject}>
							Hu???
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
export default ResdidentCardReqDetail;
