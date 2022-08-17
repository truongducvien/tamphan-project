import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useHistory } from 'react-router-dom';
import { createArea, getAreaById, updateArea } from 'services/area';
import { IAreaPayload, TypeArea, typeAreas } from 'services/area/type';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
	contactPhone: Yup.number().required('Vui lòng nhập SDT'),
	contactEmail: Yup.string().email('Định dạng email...'),
	type: Yup.object({ label: Yup.string(), value: Yup.string() }).required('Vui lòng chọn loại BDS'),
});

interface DataForm extends Omit<IAreaPayload, 'type'> {
	type: Option;
}

const DetailSubdivision: React.FC = () => {
	const mapImageRef = useRef<UploadImageRef>(null);
	const avatarImageRef = useRef<UploadImageRef>(null);

	const { changeAction, id, action } = useActionPage();
	const {
		data: detailData,
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getAreaById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const mutationCreate = useMutation(createArea);
	const mutationUpdate = useMutation(updateArea);
	const { toast } = useToastInstance();

	const handelCreate = async (data: IAreaPayload, reset: () => void) => {
		try {
			await mutationCreate.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IAreaPayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const dataImage = {
			avatarLink: avatarImageRef.current?.onSubmit().files[0],
			mapLink: mapImageRef.current?.onSubmit().files[0],
		};
		const prepareData = { ...data, type: data.type.value as TypeArea, ...dataImage };

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (isFetching || isError) return null;

	const defaultData = { ...detailData?.data, type: typeAreas.find(i => i.value === detailData?.data?.type) };
	const isDisabled = action === 'detail';

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					defaultValues={defaultData as unknown as { [x: string]: string }}
					onSubmit={onSubmit}
					validationSchema={validationSchema}
				>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Tên phân khu" name="name" variant="admin" />
						<TextFieldHookForm isDisabled={isDisabled} label="Điện thoại liên hệ" name="contactPhone" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							isDisabled={isDisabled}
							label="Loại hình BDS"
							name="type"
							options={typeAreas}
							isSearchable={false}
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Email" name="contactEmail" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} label="Diện tích" type="number" name="acreage" variant="admin" />
						<TextFieldHookForm isDisabled={isDisabled} label="Vị trí" name="location" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<FormControl>
							<FormLabel>Bản đồ</FormLabel>
							<UploadImage
								ref={mapImageRef}
								service="AREAS"
								isDisabled={isDisabled}
								defaultValue={defaultData?.mapLink ? [defaultData?.mapLink] : []}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Avatar</FormLabel>
							<UploadImage
								ref={avatarImageRef}
								service="AREAS"
								isDisabled={isDisabled}
								defaultValue={defaultData?.avatarLink ? [defaultData?.avatarLink] : []}
							/>
						</FormControl>
					</Stack>
					<HStack pt={3} justify="end">
						{action === 'detail' && (
							<Button type="button" onClick={() => changeAction('edit', id || '')} variant="brand">
								Chỉnh sửa
							</Button>
						)}
						<Button w="20" disabled={action === 'detail'} type="submit" variant="brand">
							Lưu
						</Button>
						<Button w="20" type="button" variant="gray" onClick={() => history.goBack()}>
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default DetailSubdivision;
