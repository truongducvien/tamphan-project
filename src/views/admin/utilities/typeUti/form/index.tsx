import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import UploadImage from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useHistory } from 'react-router-dom';
import { createUtilsGroup, getUtilsGroupById, updateUtilsGroup } from 'services/utils/group';
import { IUtilsGroupPayload } from 'services/utils/group/type';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
});

interface IUtilsGroupForm extends Omit<IUtilsGroupPayload, 'state' | 'id'> {
	state: Option;
}

const TypeUtilitiesForm: React.FC = () => {
	const { changeAction, id, action } = useActionPage();
	const {
		data: detailData,
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getUtilsGroupById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const mutationCreate = useMutation(createUtilsGroup);
	const mutationUpdate = useMutation(updateUtilsGroup);
	const { toast } = useToastInstance();

	const handelCreate = async (data: IUtilsGroupForm, reset: () => void) => {
		const prepareData = { ...data, state: data.state.value };

		try {
			await mutationCreate.mutateAsync(prepareData);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IUtilsGroupForm) => {
		const prepareData = { ...data, state: data.state.value, id: id || '' };

		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật Tthành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: IUtilsGroupForm, reset: () => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(data, reset) : handelUpdate(data);
	};

	if (isFetching || isError) return null;

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={onSubmit}
					defaultValues={detailData?.data as unknown as { [x: string]: string }}
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
							defaultValue={statusOption2[0]}
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
						<FormControl>
							<FormLabel>Hình ảnh</FormLabel>
							<UploadImage />
						</FormControl>
					</Stack>
					<HStack pt={3} justify="end">
						{action === 'detail' && (
							<Button type="button" onClick={() => changeAction('edit', id || '', false)} variant="brand">
								Chỉnh sửa
							</Button>
						)}
						<Button w="20" disabled={action === 'detail'} type="submit" variant="brand">
							Lưu
						</Button>
						,
						<Button w="20" type="button" variant="gray" onClick={() => history.goBack()}>
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default TypeUtilitiesForm;
