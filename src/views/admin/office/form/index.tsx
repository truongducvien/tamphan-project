import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import dayjs from 'helpers/dayjs';
import useActionPage from 'hooks/useActionPage';
import { useHistory } from 'react-router-dom';
import { createOffice, getAllOffice, getOfficeById, updateOffice } from 'services/office';
import { IOfficePayload } from 'services/office/type';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập đơn vị'),
	parentId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

interface DataForm extends Omit<IOfficePayload, 'parentId'> {
	parentId: Option;
}

const DetailOffice: React.FC = () => {
	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const { data: dataParent, isFetched: isFetchedParent } = useQuery(['list'], getAllOffice);

	const {
		data: detailData,
		isFetched,
		isError,
	} = useQuery(['detail', id], () => getOfficeById(id || ''), {
		enabled: !!id && isFetchedParent,
	});

	const history = useHistory();
	const mutationCreate = useMutation(createOffice);
	const mutationUpdate = useMutation(updateOffice);

	const handelCreate = async (data: DataForm, reset: () => void) => {
		const prepareData = { ...data, parentId: data.parentId?.value as string };
		try {
			await mutationCreate.mutateAsync(prepareData);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: DataForm) => {
		const prepareData = { ...data, parentId: data.parentId?.value as string, id: id || '' };
		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(data, reset) : handelUpdate(data);
	};

	if (!!id && (!isFetched || isError)) return null;

	const defaultValue = {
		...detailData?.data,
		parentId: dataParent?.items
			.map(i => ({ label: i.name, value: i.id }))
			.find(i => i.value === detailData?.data?.parentId),
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
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
							label="Tên đơn vị"
							name="name"
							variant="admin"
						/>
						<PullDowndHookForm
							label="Đơn vị trực thuộc"
							name="parentId"
							isDisabled={action === 'detail'}
							options={dataParent?.items.map(i => ({ label: i.name, value: i.id })) || []}
							isSearchable={false}
							isClearable
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextAreaFieldHookForm
							label="Mô tả"
							w={action === 'create' ? { base: '100%', md: '50%' } : undefined}
							isDisabled={action === 'detail'}
							name="description"
							variant="admin"
						/>
						<TextFieldHookForm
							hidden={action === 'create'}
							label="Ngày tạo"
							name=""
							defaultValue={dayjs().format('DD/MM/YYYY')}
							isDisabled
							variant="admin"
						/>
					</Stack>
					<HStack pb={3} justifyContent="flex-end">
						{action === 'detail' && (
							<Button type="button" onClick={() => changeAction('edit', id || '')} variant="brand">
								Chỉnh sửa
							</Button>
						)}
						<Button w="20" disabled={action === 'detail'} type="submit" variant="brand">
							Lưu
						</Button>
						<Button w="20" onClick={() => history.goBack()} type="button" variant="gray">
							Huỷ
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default DetailOffice;
