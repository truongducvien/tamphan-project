import { useRef } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { Option, PullDownHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { useHistory } from 'react-router-dom';
import { createArea, getAreaById, updateArea } from 'services/area';
import { IAreaPayload, TypeArea, typeAreas } from 'services/area/type';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên phân khu'),
	code: Yup.string().required('Vui lòng nhập mã phân khu'),
	contactPhone: Yup.number().required('Vui lòng nhập SDT').typeError('Vui lòng nhập số điện thoại'),
	contactEmail: Yup.string().email('Sai định dạng email').nullable(),
	type: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn loại BDS') }).required(
		'Vui lòng chọn loại BDS',
	),
});

interface DataForm extends Omit<IAreaPayload, 'type'> {
	type: Option;
}

const DetailArea: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const mapImageRef = useRef<UploadImageRef>(null);
	const avatarImageRef = useRef<UploadImageRef>(null);
	const cardImageRef = useRef<UploadImageRef>(null);
	const { changeAction, id, action, goback } = useActionPage();
	const {
		data: detailData,
		isFetching,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getAreaById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createArea);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateArea);
	const { toast } = useToastInstance();

	const handelCreate = async (data: IAreaPayload, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			mapImageRef.current?.onReset();
			avatarImageRef.current?.onReset();
			cardImageRef.current?.onReset();
			reset();
			goback();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IAreaPayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
			goback();
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const dataImage = {
			avatarLink: avatarImageRef.current?.onSubmit().files[0],
			mapLink: mapImageRef.current?.onSubmit().files,
			residentCardTemplateLink: cardImageRef.current?.onSubmit().files[0],
		};

		if (!dataImage.residentCardTemplateLink) {
			toast({
				title: 'Vui lòng chọn Ảnh thẻ cư dân',
				status: 'error',
			});
			return;
		}
		const prepareData = { ...data, type: data.type.value as TypeArea, ...dataImage };

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && (isFetching || isError || isLoading)) return <Loading />;

	const defaultData = { ...detailData?.data, type: typeAreas.find(i => i.value === detailData?.data?.type) };
	const isDisabled = action === 'detail';

	return (
		<Box pt="10px">
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
						<TextFieldHookForm isDisabled={isDisabled} label="Mã phân khu" name="code" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDownHookForm
							isDisabled={isDisabled}
							label="Loại hình BDS"
							name="type"
							options={typeAreas}
							isSearchable={false}
						/>
						<TextFieldHookForm
							isDisabled={isDisabled}
							isRequired
							label="Điện thoại liên hệ"
							type="number"
							step={0}
							name="contactPhone"
							variant="admin"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} label="Diện tích" name="acreage" variant="admin" />
						<TextFieldHookForm isDisabled={isDisabled} label="Email" name="contactEmail" variant="admin" />
					</Stack>
					<Box pr={2} mb={3} w={{ base: '100%', md: '50%' }}>
						<TextFieldHookForm isDisabled={isDisabled} label="Vị trí" name="location" variant="admin" />
					</Box>
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
								isMulti
								isDisabled={isDisabled}
								defaultValue={defaultData?.mapLink ? defaultData?.mapLink : []}
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
						<FormControl isRequired>
							<FormLabel>Ảnh thẻ cư dân</FormLabel>
							<UploadImage
								ref={cardImageRef}
								service="AREAS"
								isDisabled={isDisabled}
								defaultValue={defaultData?.residentCardTemplateLink ? [defaultData?.residentCardTemplateLink] : []}
							/>
						</FormControl>
					</Stack>
					<HStack pt={3} justify="end">
						<Button
							type="button"
							hidden={!permistionAction.UPDATE || action !== 'detail'}
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
							isLoading={isCreating || isUpdating}
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
export default DetailArea;
