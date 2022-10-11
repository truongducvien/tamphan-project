import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, SimpleGrid, Stack, useDisclosure } from '@chakra-ui/react';
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
import { getReportById } from 'src/services/report';
import { reportStatusOption, reportTypeOptions } from 'src/services/report/type';
import { residentAuthReqAccept, residentAuthReqReject } from 'src/services/residentAuthReq';
import { ResidentAuthReqStatus } from 'src/services/residentAuthReq/type';

import ModalAddTask from '../modal/AddTask';

const ReportDetailTab: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { id } = useActionPage();
	const { toast } = useToastInstance();
	const { onClose, onOpen, isOpen } = useDisclosure();
	const {
		data: detailData,
		isFetched,
		isError,
		refetch,
		isLoading,
		isRefetching,
	} = useQuery(['getReportById', id], () => getReportById(id || ''), {
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
		type: reportTypeOptions.find(i => i.value === detailData?.type),
		propertyCode: detailData?.property.code,
		areaName: detailData?.property.areaName,
		status: reportStatusOption.find(i => detailData?.status === i.value),
		mandatorName: detailData?.mandator?.fullName,
		mandatorPhone: detailData?.mandator?.phoneNumber,
		effectiveDate: formatDate(detailData?.effectiveDate),
		expiredDate: formatDate(detailData?.expiredDate),
		createdDate: formatDate(detailData?.createdDate),
		updatedDate: formatDate(detailData?.updatedDate),
	};

	return (
		<Box pt="10px">
			<FormContainer defaultValues={defaultValue as unknown as { [x: string]: string }}>
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} pb={3}>
					<TextFieldHookForm label="Mã phản ánh" name="code" isDisabled />
					<PullDownHookForm options={[]} label="Loại hỗ trợ" isDisabled name="type" />
					<TextFieldHookForm label="Mã căn hộ" isDisabled name="propertyCode" />
					<PullDownHookForm label="Trạng thái xử lý" options={[]} isDisabled name="status" />
					<TextFieldHookForm label="Phân khu" isDisabled name="areaName" />
					<TextFieldHookForm label="Thời gian phản ánh" name="createdDate" isDisabled />
					<TextFieldHookForm label="Người phản ánh" isDisabled name="mandatorName" />
					<TextFieldHookForm label="Vai trò" isDisabled name="role" />
					<TextFieldHookForm label="Thời gian dự kiến hoàn thành" name="createdDate" isDisabled />
					<TextFieldHookForm label="SDT " isDisabled name="phone" />
					<TextAreaFieldHookForm label="Nội dung" isDisabled name="authorizationDetail" />
					<TextFieldHookForm label="Điểm đánh giá" isDisabled name="code" />
					<TextAreaFieldHookForm label="Ý kiến cư dân" isDisabled name="authorizationDetail" />
					<Box mb={3}>
						<FormControl>
							<FormLabel>File đính kèm</FormLabel>
							<UploadImage isDisabled defaultValue={defaultValue?.hardCopyLinks} />
						</FormControl>
					</Box>
				</SimpleGrid>
				<HStack pb={3} justifyContent="flex-end">
					<Button
						hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={onAccept}
						type="button"
						variant="brand"
					>
						Tiếp nhận
					</Button>

					<Button
						hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={onReject}
						type="button"
						variant="delete"
					>
						Từ chối
					</Button>
					<Button
						// hidden={detailData?.status !== ResidentAuthReqStatus.WAITING_APPROVED || !permistionAction.APPROVE}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={onOpen}
						type="button"
						variant="brand"
					>
						Thêm công việc
					</Button>
					<Button onClick={() => history.goBack()} type="button" variant="gray">
						Quay lại
					</Button>
				</HStack>
			</FormContainer>
			<ModalAddTask isOpen={isOpen} onClose={onClose} />
		</Box>
	);
};
export default ReportDetailTab;
