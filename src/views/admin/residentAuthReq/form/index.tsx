import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import UploadImage from 'src/components/fileUpload';
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
import { getResidentAuthReqById, residentAuthReqAccept, residentAuthReqReject } from 'src/services/residentAuthReq';
import {
	authorizationItemOption,
	authorizationStatusOption,
	ResidentAuthReqStatus,
} from 'src/services/residentAuthReq/type';

const ResdidentAuthReqDetail: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { id } = useActionPage();
	const { toast } = useToastInstance();

	const {
		data: detailData,
		isFetched,
		isError,
		refetch,
		isLoading,
		isRefetching,
	} = useQuery(['getResidentCardReqById', id], () => getResidentAuthReqById(id || ''), {
		enabled: !!id,
	});
	const update = useForceUpdate();
	const history = useHistory();
	const mutationAcept = useMutation(residentAuthReqAccept);
	const mutationReject = useMutation(residentAuthReqReject);

	const onAccept = async () => {
		try {
			const next = await alert({
				title: 'B???n c?? ch???c ch???n mu???n duy???t y??u c???u kh??ng',
			});
			if (!next) return;
			await mutationAcept.mutateAsync(id || '');
			toast({ title: 'Ph?? duy???t th??nh c??ng' });
			refetch();
		} catch (err) {
			toast({
				title: 'Ph?? duy???t th???t b???i',
				status: 'error',
			});
		}
	};

	const onReject = async () => {
		const next = await alert({
			title: 'B???n c?? ch???c ch???n mu???n T??? ch???i y??u c???u kh??ng',
			type: 'error',
		});
		if (!next) return;
		try {
			await mutationReject.mutateAsync(id || '');
			toast({ title: 'T??? ch???i y??u c???u th??nh c??ng' });
			refetch();
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
		authorizedPersonName: detailData?.authorizedPerson.fullName,
		authorizedPersonPhone: detailData?.authorizedPerson.phoneNumber,
		propertyCode: detailData?.property.code,
		areaName: detailData?.property.areaName,
		authorizationItem: authorizationItemOption.find(i => detailData?.authorizationItem === i.value),
		mandatorName: detailData?.mandator?.fullName,
		mandatorPhone: detailData?.mandator?.phoneNumber,
		status: authorizationStatusOption.find(i => detailData?.status === i.value)?.label,
		effectiveDate: formatDate(detailData?.effectiveDate),
		expiredDate: formatDate(detailData?.expiredDate),
		createdDate: formatDate(detailData?.createdDate),
		updatedDate: formatDate(detailData?.updatedDate),
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
						<TextFieldHookForm label="M?? y??u c???u" name="code" isDisabled variant="admin" />
						<TextFieldHookForm label="Ng?????i ???????c u??? quy???n" name="authorizedPersonName" isDisabled variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="M?? c??n h???" isDisabled name="propertyCode" variant="admin" />
						<TextFieldHookForm label="S??T ng?????i ???????c u??? quy???n" isDisabled name="authorizedPersonPhone" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ph??n khu" isDisabled name="areaName" variant="admin" />
						<PullDownHookForm
							options={[]}
							label="H???ng m???c u??? quy???n"
							// value={formatDate(detailData?.requestedDate, { type: 'export' }) || ''}
							isDisabled
							name="authorizationItem"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ng?????i ????ng k??" isDisabled name="mandatorName" variant="admin" />
						<TextFieldHookForm label="Ng??y hi???u l???c" isDisabled name="effectiveDate" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="S??T ng?????i ????ng k??" isDisabled name="mandatorPhone" variant="admin" />
						<TextFieldHookForm label="Ng??y k???t th??c" isDisabled name="expiredDate" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ng??y g???i y??u c???u" isDisabled name="createdDate" variant="admin" />
						<TextFieldHookForm label="Tr???ng th??i y??u c???u" isDisabled name="status" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm label="L?? do" isDisabled name="authorizationDetail" variant="admin" />
						<TextFieldHookForm label="Ng??y ph?? duy???t" isDisabled name="updatedDate" variant="admin" />
					</Stack>
					<Box mb={3}>
						<FormControl>
							<FormLabel>File ????nh k??m</FormLabel>
							<UploadImage isDisabled defaultValue={defaultValue?.hardCopyLinks} />
						</FormControl>
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							w="20"
							hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onAccept}
							type="button"
							variant="brand"
						>
							Duy???t
						</Button>
						<Button
							w="20"
							hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onReject}
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
		</Box>
	);
};
export default ResdidentAuthReqDetail;
