import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Card from 'components/card/Card';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { useHistory } from 'react-router-dom';
import { BaseResponeAction } from 'services/type';
import { createUtilsGroup, getUtilsGroupById, updateUtilsGroup } from 'services/utils/group';
import { IUtilsGroupPayload } from 'services/utils/group/type';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	state: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

interface IUtilsGroupForm extends Omit<IUtilsGroupPayload, 'state' | 'id'> {
	state: Option;
}

const TypeUtilitiesForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const imageRef = useRef<UploadImageRef>(null);
	const { changeAction, id, action } = useActionPage();
	const {
		data: detailData,
		isFetching,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getUtilsGroupById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCeating } = useMutation(createUtilsGroup);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateUtilsGroup);
	const { toast } = useToastInstance();

	const handelCreate = async (data: IUtilsGroupForm, reset: () => void) => {
		const imageLink = imageRef.current?.onSubmit();
		const prepareData = { ...data, state: data.state.value, imageLink: imageLink?.files[0] || '' };
		try {
			await mutationCreate(prepareData);
			toast({ title: 'Tạo mới thành công' });
			reset();
			imageRef.current?.onReset();
		} catch (error) {
			const err = error as AxiosError<BaseResponeAction>;
			if (err.response?.data?.code === 'FACILITY_GROUP_DUPLICATE_NAME') {
				toast({ title: 'Tên loại tiện ích đã tồn tại', status: 'error' });
				return;
			}

			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IUtilsGroupForm) => {
		const imageLink = imageRef.current?.onSubmit();

		const prepareData = { ...data, state: data.state.value, imageLink: imageLink?.files[0] || '', id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: IUtilsGroupForm, reset: () => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(data, reset) : handelUpdate(data);
	};

	if (!!id && (isFetching || isError || isLoading)) return <Loading />;

	const defaultValue = { ...detailData?.data, state: statusOption2.find(i => i.value === detailData?.data?.state) };

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
						<PullDowndHookForm
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
export default TypeUtilitiesForm;
