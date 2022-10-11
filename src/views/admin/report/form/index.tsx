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

const ReportDetail: React.FC<BaseComponentProps> = ({ request }) => {
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
				title: 'Bạn có chắc chắn muốn duyệt yêu cầu không',
			});
			if (!next) return;
			await mutationAcept.mutateAsync(id || '');
			toast({ title: 'Phê duyệt thành công' });
			refetch();
		} catch (err) {
			toast({
				title: 'Phê duyệt thất bại',
				status: 'error',
			});
		}
	};

	const onReject = async () => {
		const next = await alert({
			title: 'Bạn có chắc chắn muốn Từ chối yêu cầu không',
			type: 'error',
		});
		if (!next) return;
		try {
			await mutationReject.mutateAsync(id || '');
			toast({ title: 'Từ chối yêu cầu thành công' });
			refetch();
		} catch {
			toast({ title: 'Từ chối yêu cầu thất bại', status: 'error' });
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
						<TextFieldHookForm label="Mã yêu cầu" name="code" isDisabled variant="admin" />
						<TextFieldHookForm label="Người được uỷ quyền" name="authorizedPersonName" isDisabled variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Mã căn hộ" isDisabled name="propertyCode" variant="admin" />
						<TextFieldHookForm label="SDT người được uỷ quyền" isDisabled name="authorizedPersonPhone" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Phân khu" isDisabled name="areaName" variant="admin" />
						<PullDownHookForm
							options={[]}
							label="Hạng mục uỷ quyền"
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
						<TextFieldHookForm label="Người đăng kí" isDisabled name="mandatorName" variant="admin" />
						<TextFieldHookForm label="Ngày hiệu lực" isDisabled name="effectiveDate" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="SĐT người đăng kí" isDisabled name="mandatorPhone" variant="admin" />
						<TextFieldHookForm label="Ngày kết thúc" isDisabled name="expiredDate" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Ngày gửi yêu cầu" isDisabled name="createdDate" variant="admin" />
						<TextFieldHookForm label="Trạng thái yêu cầu" isDisabled name="status" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm label="Lý do" isDisabled name="authorizationDetail" variant="admin" />
						<TextFieldHookForm label="Ngày phê duyệt" isDisabled name="updatedDate" variant="admin" />
					</Stack>
					<Box mb={3}>
						<FormControl>
							<FormLabel>File đính kèm</FormLabel>
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
							Duyệt
						</Button>
						<Button
							w="20"
							hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onReject}
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
		</Box>
	);
};
export default ReportDetail;
