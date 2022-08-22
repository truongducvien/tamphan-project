import { useRef, useState } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import UploadImage, { UploadImageRef } from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { SwichHookForm } from 'components/form/SwichHookForm';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useHistory } from 'react-router-dom';
import { getArea } from 'services/area';
import { createUtils, getUtilsById, updateUtils } from 'services/utils';
import { getUtilsGroup } from 'services/utils/group';
import { IUtilsCreatePayload, TimeSlotType, timeSlotTypeOption } from 'services/utils/type';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên tiện ích'),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn phân khu') }),
	timeSlotType: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	capacity: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập sức chứa'),
	facilityGroupId: Yup.object({
		label: Yup.string(),
		value: Yup.string().required('Vui lòng chọn loại tiện ích'),
	}),
});

interface IUtilsForm
	extends Omit<
		IUtilsCreatePayload,
		| 'state'
		| 'id'
		| 'areaId'
		| 'facilityGroupId'
		| 'operatingTime'
		| 'timeSlots'
		| 'capacity'
		| 'dateOffs'
		| 'timeSlotType'
	> {
	areaId: Option;
	state: Option;
	facilityGroupId: Option;
	operatingTime: string;
	timeSlots: string;
	capacity: string;
	dateOffs: string;
	timeSlotType: Option;
}
const UtilitiesForm: React.FC = () => {
	const { toast } = useToastInstance();
	const history = useHistory();
	const { changeAction, id, action } = useActionPage();
	const imageRef = useRef<UploadImageRef>(null);
	const [keywordGroup, setKeywordGroup] = useState('');
	const [keywordArea, setKeywordArea] = useState('');

	const keywordGroupDebound = useDebounce(keywordGroup, 500);
	const keywordAreaDebound = useDebounce(keywordArea, 500);

	const { data: dataGroup, isFetchedAfterMount: fetchedGroup } = useQuery(['listDataGroup', keywordGroupDebound], () =>
		getUtilsGroup({ name: keywordGroupDebound }),
	);
	const { data: dataArea, isFetchedAfterMount: fetchedArea } = useQuery(['listDataArea', keywordAreaDebound], () =>
		getArea({ name: keywordAreaDebound }),
	);

	const mutationCreate = useMutation(createUtils);
	const mutationUpdate = useMutation(updateUtils);

	const handelCreate = async (data: IUtilsCreatePayload, reset: () => void) => {
		try {
			await mutationCreate.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IUtilsCreatePayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};
	const {
		data: detailData,
		isFetched,
		isError,
	} = useQuery(['detail', id], () => getUtilsById(id || ''), {
		enabled: !!id && fetchedGroup && fetchedArea,
	});

	const onSubmit = (data: IUtilsForm, reset: () => void) => {
		const operatingTime = data.operatingTime ? data.operatingTime?.split('-') : '';
		const timeSlots = data.timeSlots ? data.timeSlots?.split(',') : '';
		const imageLink = imageRef.current?.onSubmit();
		const prepareData = {
			...data,
			state: data.state?.value as string,
			areaId: (data.areaId?.value as string) || detailData?.data?.areaId || '',
			facilityGroupId: (data.facilityGroupId?.value as string) || detailData?.data?.facilityGroupId || '',
			capacity: Number(data.capacity),
			maxOrderNumber: Number(data.maxOrderNumber),
			depositAmount: Number(data.depositAmount),
			operatingTime: operatingTime ? { start: operatingTime[0], end: operatingTime[1] } : operatingTime,
			timeSlots: timeSlots
				? timeSlots.map(i => {
						const items = i?.split('-');
						return { start: items[0], end: items[1] };
				  })
				: timeSlots,
			dateOffs: data.dateOffs?.split(','),
			imageLink: imageLink?.files || [],
			timeSlotType: (data?.timeSlotType.value as TimeSlotType) || detailData?.data?.timeSlotType,
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && (!isFetched || isError)) return null;

	const dataDefault = {
		...detailData?.data,
		areaId: dataArea?.items.map(i => ({ label: i.name, value: i.id })).find(i => i.value === detailData?.data?.areaId),
		facilityGroupId: dataGroup?.items
			.map(i => ({ label: i.name, value: i.id }))
			.find(i => i.value === detailData?.data?.facilityGroupId),
		operatingTime: detailData?.data?.operatingTime
			? `${detailData?.data?.operatingTime.start || ''} - ${detailData?.data?.operatingTime.end || ''}`
			: '',
		timeSlots: detailData?.data?.timeSlots.map(i => `${i.start} - ${i.end}`).join(', '),
		dateOffs: detailData?.data?.dateOffs.join(','),
		state: statusOption2.find(i => i.value === detailData?.data?.state),
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={dataDefault as unknown as { [x: string]: string }}
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
							label="Tên tiện ích"
							name="name"
							variant="admin"
						/>
						<PullDowndHookForm
							label="Phân khu"
							name="areaId"
							isDisabled={action === 'detail'}
							isRequired
							options={dataArea?.items.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordArea}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Loại tiện ích"
							isDisabled={action === 'detail'}
							isRequired
							name="facilityGroupId"
							options={dataGroup?.items.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordGroup}
						/>
						<TextFieldHookForm isDisabled={action === 'detail'} label="Địa chỉ" name="address" variant="admin" />
					</Stack>

					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							placeholder="10:00-11:00"
							label="Giờ hoạt động"
							name="operatingTime"
							variant="admin"
						/>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							label="Sức chứa"
							name="capacity"
							variant="admin"
							isRequired
							type="number"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						align="end"
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							isDisabled={action === 'detail'}
							label="Loại khung giờ sử dụng"
							name="timeSlotType"
							options={timeSlotTypeOption}
						/>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							label="Số tiền đặt cọc"
							name="depositAmount"
							variant="admin"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							placeholder="10:00-11: 00, 12:00-1:00"
							label="Khung giờ"
							name="timeSlots"
							variant="admin"
							isDisabled={action === 'detail'}
						/>
						<TextFieldHookForm
							label="Số lượng tối đa cho phép đặt"
							name="maxOrderNumber"
							type="number"
							variant="admin"
							isDisabled={action === 'detail'}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							placeholder="2021-03-20,2021-03-20"
							label="Ngày nghỉ"
							name="dateOffs"
							variant="admin"
						/>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							label="Số điện thoại liên hệ"
							name="phoneNumber"
							type="number"
							variant="admin"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<SwichHookForm
							isDisabled={action === 'detail'}
							label="Cho phép đặt chỗ qua App"
							variant="admin"
							name="isAllowBookViaApp"
						/>
						<PullDowndHookForm
							label="Trạng thái"
							name="state"
							isDisabled={action === 'detail'}
							options={statusOption2}
							isSearchable={false}
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<FormControl>
							<FormLabel>Hình ảnh</FormLabel>
							<UploadImage
								service="PROPERTIES"
								ref={imageRef}
								isMulti
								isDisabled={action === 'detail'}
								defaultValue={detailData?.data?.imageLink ? detailData?.data?.imageLink : []}
							/>
						</FormControl>
						<TextAreaFieldHookForm label="Mô tả" variant="admin" name="description" />
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
export default UtilitiesForm;
