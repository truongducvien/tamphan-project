import { useMemo, useRef, useState } from 'react';

import { Box, Button, FormControl, FormLabel, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import UploadImage from 'components/fileUpload';
import { FormContainer } from 'components/form';
import { CheckboxHookForm } from 'components/form/Checkbox';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useHistory } from 'react-router-dom';
import { getArea } from 'services/area';
import { createUtils, getUtilsById, updateUtils } from 'services/utils';
import { getUtilsGroup } from 'services/utils/group';
import { IUtilsCreatePayload } from 'services/utils/type';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên tiện ích'),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).required('Vui lòng chọn phân khu'),
	amenitiesGroupId: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).required('Vui lòng chọn loại tiện ích'),
});

interface IUtilsForm
	extends Omit<
		IUtilsCreatePayload,
		'state' | 'id' | 'areaId' | 'amenitiesGroupId' | 'operatingTime' | 'timeSlots' | 'capacity' | 'dateOffs'
	> {
	areaId: Option;
	state: Option;
	amenitiesGroupId: Option;
	operatingTime: string;
	timeSlots: string;
	capacity: string;
	dateOffs: string;
}
const UtilitiesForm: React.FC = () => {
	const { toast } = useToastInstance();
	const history = useHistory();
	const { changeAction, id, action } = useActionPage();

	const [keywordGroup, setKeywordGroup] = useState('');
	const [keywordArea, setKeywordArea] = useState('');

	const keywordGroupDebound = useDebounce(keywordGroup, 500);
	const keywordAreaDebound = useDebounce(keywordArea, 500);

	const { data: dataGroup, isFetchedAfterMount: fetchedGroup } = useQuery(['listDataGroup', keywordGroupDebound], () =>
		getUtilsGroup(keywordGroupDebound),
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
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getUtilsById(id || ''), {
		enabled: !!id,
	});

	const onSubmit = (data: IUtilsForm, reset: () => void) => {
		const operatingTime = data.operatingTime ? data.operatingTime.split('-') : '';
		const timeSlots = data.timeSlots ? data.timeSlots.split(',') : '';
		const prepareData = {
			...data,
			state: data.state.value as string,
			areaId: (data.areaId.value as string) || detailData?.data?.areaId || '',
			amenitiesGroupId: (data.amenitiesGroupId.value as string) || detailData?.data?.amenitiesGroupId || '',
			capacity: Number(data.capacity),
			maxOrderNumber: Number(data.maxOrderNumber),
			depositAmount: Number(data.depositAmount),
			operatingTime: operatingTime ? { start: operatingTime[0], end: operatingTime[1] } : operatingTime,
			timeSlots: timeSlots
				? timeSlots.map(i => {
						const items = i.split('-');
						return { start: items[0], end: items[1] };
				  })
				: timeSlots,
			dateOffs: data.dateOffs.split(','),
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	const dataDefault = useMemo(() => {
		if (!detailData?.data || !fetchedGroup || !fetchedArea) return {};
		return {
			...detailData.data,
			areaId: dataArea?.items
				.map(i => ({ label: i.name, value: i.id }))
				.find(i => i.value === detailData?.data?.areaId),
			amenitiesGroupId: dataGroup?.items
				.map(i => ({ label: i.name, value: i.id }))
				.find(i => i.value === detailData?.data?.amenitiesGroupId),
			operatingTime: `${detailData?.data?.operatingTime.start || ''} - ${detailData?.data?.operatingTime.end || ''}`,
			timeSlots: detailData?.data?.timeSlots.map(i => `${i.start} - ${i.end}`).join(', '),
			dateOffs: detailData?.data?.dateOffs.join(','),
			state: statusOption2.find(i => i.value === detailData.data?.state),
		};
	}, [detailData?.data, fetchedGroup, fetchedArea, dataArea?.items, dataGroup?.items]);

	if (isFetching || isError || !fetchedGroup || !fetchedArea) return null;

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
						<TextFieldHookForm isRequired label="Tên tiện ích" name="name" variant="admin" />
						<PullDowndHookForm
							label="Phân khu"
							name="areaId"
							isRequired
							options={dataArea?.items.map(i => ({ label: i.name, value: i.id })) || []}
							isSearchable={false}
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
							isRequired
							name="amenitiesGroupId"
							options={dataGroup?.items.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordGroup}
							isSearchable={false}
						/>
						<TextFieldHookForm label="Địa chỉ" name="address" variant="admin" />
					</Stack>

					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm placeholder="10:00-11:00" label="Giờ hoạt động" name="operatingTime" variant="admin" />
						<TextFieldHookForm label="Sức chứa" name="capacity" variant="admin" type="number" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						align="end"
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm label="Loại khung giờ sử dụng" name="timeSlotType" variant="admin" />
						<TextFieldHookForm label="Số tiền đặc cọc" name="depositAmount" variant="admin" />
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
						/>
						<TextFieldHookForm
							label="Số lượng tối đa cho phép đặt"
							name="maxOrderNumber"
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
						<TextFieldHookForm placeholder="2021-03-20,2021-03-20" label="Ngày nghĩ" name="dateOffs" variant="admin" />
						<TextFieldHookForm label="Số điện thoại liên hệ" name="phoneNumber" type="number" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<CheckboxHookForm label="Cho phép đặt chỗ qua App" variant="admin" name="isAllowBookViaApp" />
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
						<FormControl>
							<FormLabel>Hình ảnh</FormLabel>
							<UploadImage isMulti />
						</FormControl>
						<TextAreaFieldHookForm label="Mô tả" variant="admin" name="description" />
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
