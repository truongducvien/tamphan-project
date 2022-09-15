/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRef, useState } from 'react';

import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Link, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Card from 'components/card/Card';
import { EditorRef, EditorWithRef } from 'components/editor';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { Option, PullDownHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { PullDown } from 'components/pulldown';
import { useToastInstance } from 'components/toast';
import { formatDate } from 'helpers/dayjs';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
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
import { loadImage, uploadFile } from 'services/file';
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
	status: Option;
}

const DetailArticle: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const imageRef = useRef<UploadImageRef>(null);
	const thumbnailRef = useRef<UploadImageRef>(null);
	const editorRef = useRef<EditorRef>(null);

	const [pdf, setPdf] = useState({ link: '', fileId: '' });

	const [type, setType] = useState<Option | undefined>(typeArticles[0]);

	const { changeAction, id, action, goback } = useActionPage();
	const { toast, toastAsync } = useToastInstance();

	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const {
		data: dataArea,
		isLoading: isLoadingProperty,
		fetchMore,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { code: keywordDebounce },
	});

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
		isRefetching,
	} = useQuery(['detail', id], () => getArticleById(id || ''), {
		enabled: !!id,
		onSuccess: ({ data }) => {
			if (data?.type && typeArticles.find(i => i.value === data.type)) {
				setType(typeArticles.find(i => i.value === data.type));
			}
			if (data?.contentLink) {
				setPdf({ fileId: 'Tải xuống', link: data.contentLink });
			}
		},
	});

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createArticle);
	const { mutateAsync: mutationUpdate, isLoading: isUpdatting } = useMutation(updateArticle);

	const handelCreate = async (data: Omit<IArticlePayload, 'id'>, reset: () => void) => {
		try {
			await mutationCreate(data);
			await toastAsync({ title: 'Tạo mới thành công' });
			goback();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handleUpdate = async (data: Omit<IArticlePayload, 'id'>) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			await toastAsync({ title: 'Cập nhật thành công' });
			goback();
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
			type: type?.value as TypeArticle,
			status: data.status?.value as StatusArticle,
			avatarLink: imageRef.current?.onSubmit().files[0],
			thumbnailLink: thumbnailRef.current?.onSubmit().files[0],
			content: editorRef.current?.submit() || '',
			contentLink: pdf.link,
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handleUpdate(prepareData);
	};

	const handleAddPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files;
		if (file) {
			const { data } = await uploadFile(file, 'ARTICLES');
			setPdf(data.items?.[0]);
		}
	};

	const handleDownload = async () => {
		const urlLocal = await loadImage(pdf.link);
		const link = document.createElement('a');
		link.href = urlLocal;
		link.setAttribute('download', `${pdf.fileId}.pdf`);
		document.body.appendChild(link);
		link.click();
		link.parentNode?.removeChild(link);
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
			await toastAsync({ title: `${text} bài viết thành công` });
			goback();
		} catch {
			toast({ title: `${text} thất bại', status: 'error` });
		}
	};

	if (!!id && (!isFetched || isError || isLoading || isRefetching)) return <Loading />;
	const defaultValue = {
		...detailData?.data,
		areaIds: detailData?.data?.areas.map(i => ({ label: i.name, value: i.id })),
		notificationWays: notificationWays.filter(i => detailData?.data?.notificationWays.some(ii => ii === i.value)),
		type: typeArticles.find(i => i.value === detailData?.data?.type),
		status: statusArticle.find(i => i.value === detailData?.data?.status) || statusArticle[0],
		createdAt: formatDate(detailData?.data?.createdAt),
	};

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					defaultValues={defaultValue as unknown as { [x: string]: string }}
					validationSchema={validationSchema}
				>
					<SimpleGrid spacing={3} columns={{ base: 1, md: 2 }} mb={3}>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							isRequired
							label="Tiêu đề"
							name="title"
							variant="admin"
						/>
						<PullDownHookForm
							label="Thuộc phân khu"
							name="areaIds"
							isDisabled={action === 'detail'}
							options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
							isMulti
							onInputChange={setKeyword}
							isClearable
							isLoading={isLoadingProperty}
							onLoadMore={fetchMore}
						/>

						<FormControl>
							<FormLabel>Loại bài viết</FormLabel>
							<PullDown
								name="type"
								value={type}
								onChange={newValue => setType(newValue)}
								isDisabled={action === 'detail'}
								options={typeArticles}
								isClearable={false}
							/>
						</FormControl>
						<FormControl hidden={type?.value !== TypeArticle.RESIDENT_HANDBOOK}>
							<FormLabel>Tệp đính kèm</FormLabel>
							<Input
								name="contentLink"
								hidden={action === 'detail'}
								onChange={handleAddPdf}
								type="file"
								variant="flushed"
								accept=".pdf"
							/>
							<Button size="xs" variant="link" onClick={handleDownload}>
								{pdf.fileId}
							</Button>
						</FormControl>
						<PullDownHookForm
							label="Hình thức thông báo"
							name="notificationWays"
							isDisabled={action === 'detail'}
							options={notificationWays}
							isMulti
							isClearable
						/>
						<TextFieldHookForm label="Ngày tạo" name="createdAt" isDisabled variant="admin" />
						<PullDownHookForm
							label="Trạng thái"
							name="status"
							defaultValue={defaultValue.status}
							isDisabled
							options={statusArticle}
						/>
						<TextAreaFieldHookForm
							label="Mô tả ngắn"
							isDisabled={action === 'detail'}
							name="shortContent"
							variant="admin"
						/>
					</SimpleGrid>
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
							hidden={
								!(
									action === 'detail' &&
									detailData?.data?.status !== StatusArticle.PUBLISH &&
									detailData?.data?.status !== StatusArticle.CANCEL
								) || !permistionAction.UPDATE
							}
							onClick={() => changeAction('edit', id || '')}
							variant="brand"
						>
							Chỉnh sửa
						</Button>
						<Button hidden={action === 'detail'} type="submit" variant="brand" isLoading={isUpdatting || isCreating}>
							Lưu bản nháp
						</Button>
						<HStack justifyContent="flex-end" hidden={action === 'create'}>
							<Button
								hidden={detailData?.data?.status !== StatusArticle.DRAFT || !permistionAction.UPDATE}
								type="button"
								variant="brand"
								onClick={() => handleAction(StatusArticle.WAITING_APPROVE, 'Chuyển duyệt')}
								isLoading={isUpdatting}
							>
								Chuyển duyệt
							</Button>
							<Button
								hidden={detailData?.data?.status !== StatusArticle.WAITING_APPROVE || !permistionAction.PUBLISH}
								type="button"
								variant="brand"
								onClick={() => handleAction(StatusArticle.PUBLISH)}
								isLoading={isUpdatting}
							>
								Xuất bản
							</Button>
							<Button
								hidden={detailData?.data?.status !== StatusArticle.WAITING_APPROVE || !permistionAction.PUBLISH}
								type="button"
								variant="delete"
								onClick={() => handleAction(StatusArticle.REJECT)}
								isLoading={isUpdatting}
							>
								Từ chối
							</Button>
							<Button
								hidden={detailData?.data?.status !== StatusArticle.CANCEL || !permistionAction.DELETE}
								type="button"
								variant="lightBrand"
								onClick={() => handleAction(StatusArticle.DRAFT, 'Mở')}
								isLoading={isUpdatting}
							>
								Mở bài viết
							</Button>
							<Button
								hidden={detailData?.data?.status === StatusArticle.CANCEL || !permistionAction.DELETE}
								type="button"
								variant="delete"
								onClick={() => handleAction(StatusArticle.CANCEL)}
								isLoading={isUpdatting}
							>
								Vô hiệu
							</Button>
						</HStack>
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
