/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRef, useState } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import { EditorRef, EditorWithRef } from 'components/editor';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { useHistory } from 'react-router-dom';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { createArticle, getArticleById, updateArticle } from 'services/article';
import {
	IArticlePayload,
	NotificationWays,
	notificationWays,
	StatusArticle,
	statusArticle,
	TypeArticle,
	typeArticles,
} from 'services/article/type';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	title: Yup.string().required('Vui lòng nhập tiêu đề'),
	areaIds: Yup.array()
		.of(Yup.object().shape({ label: Yup.string(), value: Yup.string() }))
		.nullable(),
	notificationWays: Yup.array()
		.of(Yup.object().shape({ label: Yup.string(), value: Yup.string() }))
		.nullable(),
	type: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	status: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

interface DataForm
	extends Omit<
		IArticlePayload,
		'areaIds' | 'notificationWays' | 'type' | 'status' | 'id' | 'thumbnailLink' | 'avatarLink'
	> {
	areaIds: Array<Option>;
	notificationWays: Array<Option>;
	type: Option;
	status: Option;
}

const DetailArticle: React.FC = () => {
	const imageRef = useRef<UploadImageRef>(null);
	const thumbnailRef = useRef<UploadImageRef>(null);
	const editorRef = useRef<EditorRef>(null);

	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const {
		data: dataArea,
		isLoading: isLoadingApartment,
		fetchMore,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { name: keywordDebounce },
	});

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
		refetch,
	} = useQuery(['detail', id], () => getArticleById(id || ''), {
		enabled: !!id,
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createArticle);
	const { mutateAsync: mutationUpdate, isLoading: isUpdatting } = useMutation(updateArticle);

	const handelCreate = async (data: Omit<IArticlePayload, 'id'>, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: Omit<IArticlePayload, 'id'>) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const prepareData = {
			...data,
			id,
			areaIds: data.areaIds?.map(i => i?.value) as Array<string>,
			notificationWays: data.notificationWays?.map(i => i?.value) as Array<NotificationWays>,
			type: data.type?.value as TypeArticle,
			status: data.status?.value as StatusArticle,
			avatarLink: imageRef.current?.onSubmit().files[0],
			thumbnailLink: thumbnailRef.current?.onSubmit().files[0],
			content: editorRef.current?.submit() || '',
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	const defaultValue = {
		...detailData?.data,
		areaIds: detailData?.data?.areas.map(i => ({ label: i.name, value: i.id })),
		notificationWays: notificationWays.filter(i => detailData?.data?.notificationWays.some(ii => ii === i.value)),
		type: typeArticles.find(i => i.value === detailData?.data?.type),
		status: statusArticle.find(i => i.value === detailData?.data?.status) || statusArticle[0],
	};

	const handleAction = async (status: StatusArticle, title?: string) => {
		if (!detailData?.data) return;
		const prepareData: IArticlePayload = {
			...detailData?.data,
			areaIds: detailData?.data?.areas.map(i => i.id),
			status,
		};
		const text = title || statusArticle.find(i => i.value === status)?.label || '';
		await alert({
			title: `Bạn muốn ${text} bài viết?`,
			type: 'error',
		});
		try {
			await mutationUpdate(prepareData);
			toast({ title: `${text} bài viết thành công` });
			refetch();
		} catch {
			toast({ title: `${text} thất bại', status: 'error` });
		}
	};

	if (!!id && (!isFetched || isError || isLoading)) return <Loading />;

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
							label="Tiêu đề"
							name="title"
							variant="admin"
						/>
						<PullDowndHookForm
							label="Thuộc phân khu"
							name="areaIds"
							isDisabled={action === 'detail'}
							options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
							isMulti
							onInputChange={setKeyword}
							isClearable
							isLoading={isLoadingApartment}
							onLoadMore={fetchMore}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Đường dẫn" name="contentLink" isDisabled={action === 'detail'} variant="admin" />
						<TextFieldHookForm label="Ngày tạo" name="createdAt" isDisabled variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Loại bài viết"
							name="type"
							isDisabled={action === 'detail'}
							options={typeArticles}
							isClearable={false}
						/>
						<PullDowndHookForm
							label="Hình thức thông báo"
							name="notificationWays"
							isDisabled={action === 'detail'}
							options={notificationWays}
							isMulti
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
							label="Mô tả ngắn"
							isDisabled={action === 'detail'}
							name="shortContent"
							variant="admin"
						/>
						<PullDowndHookForm
							label="Trạng thái"
							name="status"
							defaultValue={defaultValue.status}
							isDisabled
							options={statusArticle}
						/>
					</Stack>
					<Box pb={3}>
						<FormControl>
							<FormLabel>Nội dung</FormLabel>
							<EditorWithRef ref={editorRef} contents={defaultValue.content || ''} isDisable={action === 'detail'} />
						</FormControl>
					</Box>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<FormControl>
							<FormLabel>Ảnh đại diện</FormLabel>
							<UploadImage
								service="ARTICLES"
								ref={imageRef}
								isDisabled={action === 'detail'}
								defaultValue={detailData?.data?.avatarLink ? [detailData?.data?.avatarLink] : []}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Ảnh banner</FormLabel>
							<UploadImage
								service="ARTICLES"
								ref={thumbnailRef}
								isDisabled={action === 'detail'}
								defaultValue={detailData?.data?.thumbnailLink ? [detailData?.data?.thumbnailLink] : []}
							/>
						</FormControl>
					</Stack>
					<HStack justifyContent="flex-end">
						<Button
							type="button"
							hidden={!(action === 'detail' && detailData?.data?.status !== StatusArticle.PUBLISH)}
							onClick={() => changeAction('edit', id || '')}
							variant="brand"
						>
							Chỉnh sửa
						</Button>
						<Button hidden={action === 'detail'} type="submit" variant="brand" isLoading={isUpdatting || isCreating}>
							Lưu bản nháp
						</Button>
						<Button
							hidden={detailData?.data?.status !== StatusArticle.DRAFT}
							type="button"
							variant="brand"
							onClick={() => handleAction(StatusArticle.WAITING_APPROVE, 'Chuyển duyệt')}
							isLoading={isUpdatting}
						>
							Chuyển duyệt
						</Button>
						<Button
							hidden={detailData?.data?.status !== StatusArticle.WAITING_APPROVE}
							type="button"
							variant="brand"
							onClick={() => handleAction(StatusArticle.PUBLISH)}
							isLoading={isUpdatting}
						>
							Xuât bản
						</Button>
						<Button
							hidden={detailData?.data?.status !== StatusArticle.WAITING_APPROVE}
							type="button"
							variant="delete"
							onClick={() => handleAction(StatusArticle.REJECT)}
							isLoading={isUpdatting}
						>
							Từ chối
						</Button>
						<Button
							hidden={detailData?.data?.status !== StatusArticle.CANCEL}
							type="button"
							variant="lightBrand"
							onClick={() => handleAction(StatusArticle.DRAFT, 'Mở')}
							isLoading={isUpdatting}
						>
							Mở bài viết
						</Button>
						<Button
							hidden={detailData?.data?.status === StatusArticle.CANCEL}
							type="button"
							variant="delete"
							onClick={() => handleAction(StatusArticle.CANCEL)}
							isLoading={isUpdatting}
						>
							Vô hiệu
						</Button>
						<Button onClick={() => history.goBack()} type="button" variant="gray">
							Quay lại
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default DetailArticle;
