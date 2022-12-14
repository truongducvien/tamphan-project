import { useState } from 'react';

import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Loading } from 'src/components/form/Loading';
import { BaseOption, Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextAreaFieldHookForm } from 'src/components/form/TextAreaField';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { useToastInstance } from 'src/components/toast';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import {
	createOrganization,
	getAllOrganization,
	getOrganizationById,
	updateOrganization,
} from 'src/services/organizations';
import { IOrganizationPayload } from 'src/services/organizations/type';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên đơn vị'),
	parentId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	areaIds: Yup.array()
		.of(Yup.object().shape({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn phân khu quản lý') }))
		.min(1, 'Vui lòng chọn phân khu quản lý')
		.required('Vui lòng chọn phân khu quản lý'),
});

interface DataForm extends Omit<IOrganizationPayload, 'parentId' | 'areaIds'> {
	parentId: Option;
	areaIds: Array<BaseOption<string>>;
}

const DetailOrganization: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { changeAction, id, action, goback } = useActionPage();
	const { toast } = useToastInstance();
	const [keywordArea, setKeywordArea] = useState('');

	const keywordAreaDebound = useDebounce(keywordArea, 500);

	const { data: dataParent, isFetched: isFetchedParent } = useQuery(['list'], getAllOrganization);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { code: keywordAreaDebound },
	});

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getOrganizationById(id || ''), {
		enabled: !!id && isFetchedParent,
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createOrganization);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateOrganization);

	const handelCreate = async (data: DataForm, reset: () => void) => {
		const prepareData = { ...data, parentId: data.parentId?.value as string, areaIds: data.areaIds.map(i => i.value) };
		try {
			await mutationCreate(prepareData);
			toast({ title: 'Tạo mới thành công' });
			goback();
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: DataForm) => {
		const prepareData = {
			...data,
			parentId: data.parentId?.value as string,
			id: id || '',
			areaIds: data.areaIds.map(i => i.value),
		};
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
			goback();
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(data, reset) : handelUpdate(data);
	};

	if (!!id && (!isFetched || isError || isLoading)) return <Loading />;

	const defaultValue = {
		...detailData?.data,
		parentId: dataParent?.items
			.map(i => ({ label: i.name, value: i.id }))
			.find(i => i.value === detailData?.data?.parentId),
		areaIds: detailData?.data?.areas?.map(i => ({ label: i.name, value: i.id })),
	};

	return (
		<Box pt="10px">
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
						<PullDownHookForm
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
						<TextAreaFieldHookForm label="Mô tả" isDisabled={action === 'detail'} name="description" variant="admin" />
						<PullDownHookForm
							label="Phân khu quản lý"
							isRequired
							isDisabled={action === 'detail'}
							name="areaIds"
							isMulti
							options={dataArea.map(i => ({ label: i.name, value: i.id }))}
							isLoading={isLoadingArea}
							onLoadMore={fetchMoreArea}
							onInputChange={setKeywordArea}
						/>
					</Stack>
					<HStack pb={3} justifyContent="flex-end">
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
							isLoading={isCreating || isUpdating}
							variant="brand"
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
export default DetailOrganization;
