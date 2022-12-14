import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import UploadImage, { UploadImageRef } from 'src/components/fileUpload';
import { FormContainer } from 'src/components/form';
import { Loading } from 'src/components/form/Loading';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextAreaFieldHookForm } from 'src/components/form/TextAreaField';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { createFacilityGroup, getFacilityGroupById, updateFacilityGroup } from 'src/services/facility/group';
import { IFacilityGroupPayload } from 'src/services/facility/group/type';
import { BaseResponseAction } from 'src/services/type';
import { statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	state: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

interface IFacilityGroupForm extends Omit<IFacilityGroupPayload, 'state' | 'id'> {
	state: Option;
}

const FacilityGroupForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const imageRef = useRef<UploadImageRef>(null);
	const { changeAction, id, action, goback } = useActionPage();
	const {
		data: detailData,
		isFetching,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getFacilityGroupById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCeating } = useMutation(createFacilityGroup);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateFacilityGroup);
	const { toast } = useToastInstance();

	const handelCreate = async (data: IFacilityGroupForm, reset: () => void) => {
		const imageLink = imageRef.current?.onSubmit();
		const prepareData = { ...data, state: data.state.value, imageLink: imageLink?.files[0] || '' };
		try {
			await mutationCreate(prepareData);
			toast({ title: 'Tạo mới thành công' });
			reset();
			goback();
			imageRef.current?.onReset();
		} catch (error) {
			const err = error as AxiosError<BaseResponseAction>;
			if (err.response?.data?.code === 'FACILITY_GROUP_DUPLICATE_NAME') {
				toast({ title: 'Tên loại tiện ích đã tồn tại', status: 'error' });
				return;
			}

			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IFacilityGroupForm) => {
		const imageLink = imageRef.current?.onSubmit();

		const prepareData = { ...data, state: data.state.value, imageLink: imageLink?.files[0] || '', id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
			goback();
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: IFacilityGroupForm, reset: () => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(data, reset) : handelUpdate(data);
	};

	if (!!id && (isFetching || isError || isLoading)) return <Loading />;

	const defaultValue = { ...detailData?.data, state: statusOption2.find(i => i.value === detailData?.data?.state) };

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={onSubmit}
					defaultValues={defaultValue as unknown as { [x: string]: string }}
					validationSchema={validationSchema}
				>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							isRequired
							label="Tên loại"
							name="name"
							variant="admin"
						/>
						<PullDownHookForm
							label="Trạng thái"
							name="state"
							options={statusOption2}
							isSearchable={false}
							isDisabled={action === 'detail'}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm
							isDisabled={action === 'detail'}
							rows={10}
							label="Mô tả"
							name="description"
							variant="admin"
						/>
						<TextAreaFieldHookForm
							isDisabled={action === 'detail'}
							rows={10}
							label="Điều khoản và điều kiện"
							name="termAndCondition"
							variant="admin"
						/>
					</Stack>
					<Box pb={3} w={{ base: '50%', md: '100%' }} mr="2">
						<FormControl>
							<FormLabel>Hình ảnh</FormLabel>
							<UploadImage
								isDisabled={action === 'detail'}
								service="PROPERTIES"
								ref={imageRef}
								defaultValue={detailData?.data?.imageLink ? [detailData?.data?.imageLink] : []}
							/>
						</FormControl>
					</Box>
					<HStack pt={3} justify="end">
						<Button
							hidden={!permistionAction.UPDATE || action !== 'detail'}
							type="button"
							onClick={() => changeAction('edit', id || '')}
							variant="brand"
						>
							Chỉnh sửa
						</Button>
						<Button
							w="20"
							disabled={action === 'detail'}
							type="submit"
							variant="brand"
							isLoading={isCeating || isUpdating}
						>
							Lưu
						</Button>
						<Button type="button" variant="gray" onClick={() => history.goBack()}>
							Quay lại
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default FacilityGroupForm;
