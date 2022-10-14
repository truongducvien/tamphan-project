import { Box, Button, FormControl, FormLabel, HStack, SimpleGrid, Stack, useDisclosure } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { alert } from 'src/components/alertDialog/hook';
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
import { feedbackStatusOption, feedbackTypeOptions } from 'src/services/feedback/type';
import { residentType } from 'src/services/resident/type';
import { residentAuthReqAccept, residentAuthReqReject } from 'src/services/residentAuthReq';

import { useFeedbackAction, useFeedbackState } from '../context';
import ModalAddTask from '../modal/AddTask';

const ReportDetailTab: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { id } = useActionPage();
	const { toast } = useToastInstance();
	const { onClose, onOpen, isOpen } = useDisclosure();
	const { feedbackData, loading } = useFeedbackState();
	const { refetch } = useFeedbackAction(id || '');

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
		if (!loading) update();
	}, [loading]);

	if (!!id && loading) return <Loading />;

	const defaultValue = {
		...feedbackData,
		type: feedbackTypeOptions.find(i => i.value === feedbackData?.type),
		propertyCode: feedbackData?.propertyCode,
		areaName: feedbackData?.areaName,
		status: feedbackStatusOption.find(i => feedbackData?.status === i.value),
		residentFullName: feedbackData?.residentFullName,
		residentPhoneNumber: feedbackData?.residentPhoneNumber,
		residentType: residentType.find(i => i.value === feedbackData?.residentType)?.label,
		expectedDate: formatDate(feedbackData?.expectedDate),
		actualDate: formatDate(feedbackData?.actualDate),
		createdAt: formatDate(feedbackData?.createdAt),
	};

	return (
		<Box pt="10px">
			<FormContainer defaultValues={defaultValue as unknown as { [x: string]: string }}>
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} pb={3}>
					<TextFieldHookForm label="Mã phản ánh" name="id" isDisabled />
					<PullDownHookForm options={[]} label="Loại hỗ trợ" isDisabled name="type" />
					<TextFieldHookForm label="Mã căn hộ" isDisabled name="propertyCode" />
					<PullDownHookForm label="Trạng thái xử lý" options={[]} isDisabled name="status" />
					<TextFieldHookForm label="Phân khu" isDisabled name="areaName" />
					<TextFieldHookForm label="Thời gian phản ánh" name="createdAt" isDisabled />
					<TextFieldHookForm label="Người phản ánh" isDisabled name="residentFullName" />
					<TextFieldHookForm label="Vai trò" isDisabled name="residentType" />
					<TextFieldHookForm label="Thời gian dự kiến hoàn thành" name="expectedDate" isDisabled />
					<TextFieldHookForm label="Thời gian hoàn thành thực tế" name="actualDate" isDisabled />
					<TextFieldHookForm label="SDT" isDisabled name="residentPhoneNumber" />
					<TextAreaFieldHookForm label="Nội dung" isDisabled name="content" />
					{/* <TextFieldHookForm label="Điểm đánh giá" isDisabled name="code" />
					<TextAreaFieldHookForm label="Ý kiến cư dân" isDisabled name="authorizationDetail" /> */}
					<Box mb={3}>
						<FormControl>
							<FormLabel>File đính kèm</FormLabel>
							<UploadImage isDisabled defaultValue={defaultValue?.imageLink} />
						</FormControl>
					</Box>
				</SimpleGrid>
				<HStack pb={3} justifyContent="flex-end">
					<Button
						hidden={feedbackData?.status !== 'WAITING' || !permistionAction.APPROVE}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={onAccept}
						type="button"
						variant="brand"
					>
						Tiếp nhận
					</Button>

					<Button
						hidden={feedbackData?.status !== 'WAITING' || !permistionAction.APPROVE}
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
