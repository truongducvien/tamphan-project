import { useRef, useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	SimpleGrid,
	Flex,
	Switch,
	Input,
	IconButton,
	InputGroup,
	InputRightElement,
	Icon,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MdAdd, MdClear } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { DatePicker } from 'src/components/date';
import UploadImage, { UploadImageRef } from 'src/components/fileUpload';
import { FormContainer } from 'src/components/form';
import { TimePickerHookForm } from 'src/components/form/DatePicker';
import { Loading } from 'src/components/form/Loading';
import { BaseOption, Option, PullDownHookForm } from 'src/components/form/PullDown';
import { SwitchHookForm } from 'src/components/form/SwitchHookForm';
import { TextAreaFieldHookForm } from 'src/components/form/TextAreaField';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { PullDown } from 'src/components/pulldown';
import { RangTimePicker, TimePicker } from 'src/components/timepicker';
import { useToastInstance } from 'src/components/toast';
import { formatDate } from 'src/helpers/dayjs';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { createFacility, getFacilityById, updateFacility } from 'src/services/facility';
import { getFacilityGroup } from 'src/services/facility/group';
import { IFacilityGroup, IFacilityGroupParams } from 'src/services/facility/group/type';
import { IFacilityCreatePayload, TimeSlotType, timeSlotTypeOption } from 'src/services/facility/type';
import { BaseResponseAction } from 'src/services/type';
import { statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	name: Yup.string().required('Vui l??ng nh???p t??n ti???n ??ch'),
	operatingTime: Yup.string().required('Vui l??ng ch???n gi??? ho???t ?????ng'),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui l??ng ch???n ph??n khu') }),
	capacity: Yup.number().typeError('Vui l??ng nh???p s???').required('Vui l??ng nh???p s???c ch???a'),
	phoneNumber: Yup.string()
		.required('Vui l??ng nh???p S??T')
		.matches(/^[0-9]\d{9}$/, { message: 'S??? ??i???n tho???i kh??ng h???p l???' }),
	facilityGroupId: Yup.object({
		label: Yup.string(),
		value: Yup.string().required('Vui l??ng ch???n lo???i ti???n ??ch'),
	}),
	state: Yup.object({
		label: Yup.string(),
		value: Yup.string().required('Vui l??ng ch???n tr???ng th??i'),
	}),
});
interface IFacilityForm
	extends Omit<
		IFacilityCreatePayload,
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
	capacity: string;
	dateOffs: string;
	timeSlotType: Option;
}
const FacilityForm: React.FC<BaseComponentProps> = ({ request }) => {
	const [timeSlots, setTimeSlots] = useState<Array<string>>([]);
	const [dateOffs, setDayOffs] = useState<Array<string>>([]);
	const { permistionAction } = useActionPermission(request);
	const { toast } = useToastInstance();
	const history = useHistory();
	const { changeAction, id, action, goback } = useActionPage();
	const [requirePay, setPay] = useState(false);
	const imageRef = useRef<UploadImageRef>(null);
	const [keywordGroup, setKeywordGroup] = useState('');
	const [keywordArea, setKeywordArea] = useState('');
	const [timeSlotType, setTimeSlotType] = useState(timeSlotTypeOption[0]);
	const keywordGroupDebound = useDebounce(keywordGroup, 500);
	const keywordAreaDebound = useDebounce(keywordArea, 500);

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
		data: dataGroup,
		isLoading: isLoadingGroup,
		fetchMore: fetchMoreGroup,
	} = useLoadMore<IFacilityGroup, IFacilityGroupParams>({
		id: ['listGroup', keywordGroupDebound],
		func: getFacilityGroup,
		payload: { name: keywordGroupDebound },
	});

	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createFacility);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateFacility);

	const handelCreate = async (data: IFacilityCreatePayload, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'T???o m???i th??nh c??ng' });
			reset();
			goback();
		} catch (error) {
			const err = error as AxiosError<BaseResponseAction>;
			if (err.response?.data?.code === 'DUPLICATE_FACILITY_NAME') {
				toast({ title: 'T??n ti???n ??ch ???? t???n t???i', status: 'error' });
				return;
			}
			toast({ title: 'T???o m???i th???t b???i', status: 'error' });
		}
	};

	const handelUpdate = async (data: IFacilityCreatePayload) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'C???p nh???t th??nh c??ng' });
			goback();
		} catch (error) {
			const err = error as AxiosError<BaseResponseAction>;
			if (err.response?.data?.code === 'DUPLICATE_FACILITY_NAME') {
				toast({ title: 'T??n ti???n ??ch ???? t???n t???i', status: 'error' });
				return;
			}
			toast({ title: 'C???p nh???t th???t b???i', status: 'error' });
		}
	};
	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(['detail', id], () => getFacilityById(id || ''), {
		enabled: !!id,
		onSuccess: ({ data }) => {
			setTimeSlotType(timeSlotTypeOption.find(i => i.value === data?.timeSlotType) || timeSlotTypeOption[0]);
			setPay(!!data?.depositAmount.amount);
			setDayOffs(data?.dateOffs.map(i => formatDate(i)) || []);
			setTimeSlots(data?.timeSlots?.map(i => `${i.start}-${i.end}`) || []);
		},
	});

	const onSubmit = (data: IFacilityForm, reset: () => void) => {
		const operatingTime = data.operatingTime.split('-');
		// const timeSlots = timeSlotType.value === 'HOUR' ? data.timeSlots.split(',') : [data.operatingTime];
		const imageLink = imageRef.current?.onSubmit();
		const prepareData = {
			...data,
			state: data.state?.value as string,
			areaId: (data.areaId?.value as string) || detailData?.data?.areaId || '',
			facilityGroupId: (data.facilityGroupId?.value as string) || detailData?.data?.facilityGroupId || '',
			capacity: Number(data.capacity || 0),
			maxOrderNumber: Number(data.maxOrderNumber || 0),
			depositAmount: requirePay ? Number(data.depositAmount || 0) : 0,
			depositInDuration: Number(data.depositInDuration || 0),
			operatingTime: operatingTime ? { start: operatingTime[0], end: operatingTime[1] } : operatingTime,
			// timeSlots: timeSlots.map(i => {
			// 	const items = i?.split('-');
			// 	return { start: items[0], end: items[1] };
			// }),
			dateOffs: dateOffs.map(i => formatDate(i, { type: 'BE' })),
			timeSlots: timeSlots.map(i => ({ start: i.split('-')?.[0], end: i.split('-')?.[1] })),
			imageLink: imageLink?.files || [],
			timeSlotType: timeSlotType.value,
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && (!isFetched || isError || isLoading)) return <Loading />;

	const dataDefault = {
		...detailData?.data,
		areaId: { label: detailData?.data?.areaName, value: detailData?.data?.areaId },
		facilityGroupId: {
			label: detailData?.data?.facilityGroupName,
			value: detailData?.data?.facilityGroupId,
		},
		operatingTime: detailData?.data?.operatingTime
			? `${detailData?.data?.operatingTime.start || ''}-${detailData?.data?.operatingTime.end || ''}`
			: '',
		dateOffs: detailData?.data?.dateOffs.join(','),
		state: statusOption2.find(i => i.value === detailData?.data?.state),
		depositAmount: detailData?.data?.depositAmount.amount,
	};

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={dataDefault as unknown as { [x: string]: string }}
				>
					<SimpleGrid spacing={3} columns={{ base: 1, md: 2 }}>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							isRequired
							label="T??n ti???n ??ch"
							name="name"
							variant="admin"
						/>
						<PullDownHookForm
							label="Ph??n khu"
							name="areaId"
							isDisabled={action === 'detail'}
							isRequired
							options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordArea}
							onLoadMore={fetchMoreArea}
							isLoading={isLoadingArea}
						/>

						<PullDownHookForm
							label="Lo???i ti???n ??ch"
							isDisabled={action === 'detail'}
							isRequired
							name="facilityGroupId"
							options={dataGroup.map(i => ({ label: i.name, value: i.id })) || []}
							onInputChange={setKeywordGroup}
							onLoadMore={fetchMoreGroup}
							isLoading={isLoadingGroup}
						/>
						<TextFieldHookForm isDisabled={action === 'detail'} label="?????a ch???" name="address" variant="admin" />
						<TimePickerHookForm
							isDisabled={action === 'detail'}
							placeholder="10:00-11:00"
							label="Gi??? ho???t ?????ng"
							isRequired
							name="operatingTime"
							variant="admin"
						/>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							label="S???c ch???a"
							name="capacity"
							variant="admin"
							isRequired
							type="number"
							step={0}
						/>
						<FormControl>
							<FormLabel>Lo???i khung gi???</FormLabel>
							<PullDown
								value={timeSlotType}
								isDisabled={action === 'detail'}
								name="timeSlotType"
								onChange={newValue => setTimeSlotType(newValue as BaseOption<TimeSlotType>)}
								options={timeSlotTypeOption}
							/>
						</FormControl>
						<Flex justify="center" align="end" hidden={timeSlotType.value === 'DATE'}>
							<FormControl>
								<FormLabel>Khung gi???</FormLabel>
								<InputGroup>
									<Input
										isDisabled
										value={timeSlots.join(', ')}
										placeholder="Ch???n khung gi???"
										name="timeSlots"
										variant="admin"
										pr="2.5rem"
									/>
									<InputRightElement p={0} hidden={action === 'detail' || timeSlotType.value === 'DATE'}>
										<Icon
											as={MdClear}
											w={5}
											h={5}
											right={3}
											onClick={() => setTimeSlots([])}
											position="absolute"
											cursor="pointer"
										/>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<RangTimePicker
								onChange={value => setTimeSlots(prev => [...prev, value])}
								rePlaceInput={
									<IconButton
										colorScheme="blue"
										isDisabled={action === 'detail'}
										marginLeft={3}
										aria-label="Add to friends"
										icon={<AddIcon />}
									/>
								}
								add
							/>
						</Flex>
						<Flex>
							<Flex flex={0.5}>
								<FormControl>
									<FormLabel>Y??u c???u ?????t c???c</FormLabel>
									<Switch
										isDisabled={action === 'detail'}
										name=""
										isChecked={requirePay}
										onChange={e => setPay(e.target.checked)}
									/>
								</FormControl>
							</Flex>
							<Flex flex={1} hidden={!requirePay}>
								<TextFieldHookForm
									isDisabled={action === 'detail'}
									label="S??? ti???n ?????t c???c"
									name="depositAmount"
									variant="admin"
								/>
							</Flex>
						</Flex>
						<TextFieldHookForm
							label="S??? l?????ng t???i ??a cho ph??p ?????t"
							name="maxOrderNumber"
							type="number"
							step={0}
							variant="admin"
							isDisabled={action === 'detail'}
						/>
						<Flex justify="center" align="end">
							<FormControl>
								<FormLabel>Ng??y ngh???</FormLabel>
								<InputGroup>
									<Input
										isDisabled
										value={dateOffs.join(', ')}
										placeholder="Ch???n ng??y"
										name="dateOffs"
										variant="admin"
										pr="2.5rem"
									/>
									<InputRightElement p={0}>
										<Icon
											as={MdClear}
											w={5}
											h={5}
											right={3}
											onClick={() => setDayOffs([])}
											position="absolute"
											cursor="pointer"
											display={dateOffs?.[0] && action !== 'detail' ? 'block' : 'none'}
										/>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<DatePicker
								replaceInput={
									<IconButton
										colorScheme="blue"
										isDisabled={action === 'detail'}
										marginLeft={3}
										aria-label="Add to friends"
										icon={<AddIcon />}
									/>
								}
								defaultDays={dateOffs.map(i => formatDate(i, { type: 'BE' }))}
								onChange={date =>
									setDayOffs(prev => (prev.includes(date) ? prev.filter(i => i !== date) : [...prev, date]))
								}
							/>
						</Flex>
						<TextFieldHookForm
							isRequired
							isDisabled={action === 'detail'}
							label="S??? ??i???n tho???i li??n h???"
							name="phoneNumber"
							type="number"
							step={0}
							variant="admin"
						/>
						<TextFieldHookForm
							isDisabled={action === 'detail'}
							label="Th???i h???n qu?? h???n c???c (h)"
							min={1}
							name="depositInDuration"
							type="number"
							step={0}
							variant="admin"
						/>
						<PullDownHookForm
							label="Tr???ng th??i"
							name="state"
							isDisabled={action === 'detail'}
							options={statusOption2}
							isSearchable={false}
						/>

						<TextAreaFieldHookForm label="M?? t???" variant="admin" name="description" />
						<TextAreaFieldHookForm label="Ghi ch?? ?????t c???c" variant="admin" name="depositNote" />
						<FormControl>
							<FormLabel>H??nh ???nh</FormLabel>
							<UploadImage
								service="PROPERTIES"
								ref={imageRef}
								isMulti
								isDisabled={action === 'detail'}
								defaultValue={detailData?.data?.imageLink ? detailData?.data?.imageLink : []}
							/>
						</FormControl>
						<SwitchHookForm
							isDisabled={action === 'detail'}
							label="Cho ph??p ?????t ch??? qua App"
							variant="admin"
							name="isAllowBookViaApp"
						/>
					</SimpleGrid>
					<HStack pt={3} justify="end">
						<Button
							hidden={!permistionAction.UPDATE || action !== 'detail'}
							type="button"
							onClick={() => changeAction('edit', id || '')}
							variant="brand"
						>
							Ch???nh s???a
						</Button>
						<Button
							w="20"
							disabled={action === 'detail'}
							type="submit"
							variant="brand"
							isLoading={isCreating || isUpdating}
						>
							L??u
						</Button>
						<Button type="button" variant="gray" onClick={() => history.goBack()}>
							Quay l???i
						</Button>
					</HStack>
				</FormContainer>
			</Card>
		</Box>
	);
};
export default FacilityForm;
