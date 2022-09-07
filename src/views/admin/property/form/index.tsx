import { useState } from 'react';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Box,
	Button,
	HStack,
	Stack,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Alert,
	AlertIcon,
	AlertDescription,
	useDisclosure,
	AlertTitle,
	Flex,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Loading } from 'components/form/Loading';
import { Option, PullDownHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { PullDown } from 'components/pulldown';
import { useToastInstance } from 'components/toast';
import { BaseComponentProps } from 'hocs/withPermission';
import useActionPage from 'hooks/useActionPage';
import { useActionPermission } from 'hooks/useActionPermission';
import { useDebounce } from 'hooks/useDebounce';
import useDidMount from 'hooks/useDidMount';
import { useLoadMore } from 'hooks/useLoadMore';
import { useHistory } from 'react-router-dom';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { createProperty, getPropertyById, updateProperty, updateOwner } from 'services/properties';
import { IPropertyPayload, StatusProperty, statusProperty } from 'services/properties/type';
import { getResident, getResidentOwner } from 'services/resident';
import { gender, identityCardType, IResident, IResidentParams } from 'services/resident/type';
import * as Yup from 'yup';

import { ResidentTab } from './ResidentTab';

const validationProperty = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên căn hộ'),
	code: Yup.string().required('Vui lòng nhập tên căn hộ'),
	areaId: Yup.object().shape({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn phân khu') }),
	status: Yup.object().shape({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

interface DataForm {
	acreage: string;
	address: string;
	areaId: Option;
	block: string;
	code: string;
	description: string;
	direction: string;
	floorNumber: string;
	inUserAcreage: string;
	maxResident: string;
	name: string;
	numberOfBathRoom: string;
	numberOfBedRoom: string;
	numberOfFloor: string;
	status: Option;
	type: string;
}

const AparmentForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [idProperty, setIdProperty] = useState<string>();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const [keywordResident, setKeywordResident] = useState('');
	const keyworResidentdDebounce = useDebounce(keywordResident);

	const [changeOwnerId, setOwnerID] = useState('');

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createProperty);
	const { mutateAsync: mutationUpdate, isLoading: isUpdateingProperty } = useMutation(updateProperty);

	const { mutateAsync: mutationUpdateOwner, isLoading: isUpdatetingOwner } = useMutation(updateOwner);

	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { code: keywordDebounce },
	});

	const {
		data: dataResident,
		isLoading: isLoadingResident,
		fetchMore: fetchMoreResident,
	} = useLoadMore<IResident, IResidentParams>({
		id: ['listResident', keyworResidentdDebounce],
		func: getResident,
		payload: { fullName: keyworResidentdDebounce },
	});

	const {
		data: detailData,
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getPropertyById(id || ''), {
		enabled: !!id,
	});

	const {
		data: dataOwnner,
		isFetched: isFetchedingOwner,
		isError: isErrorOwner,
		isFetching: isFetchingOwner,
		isRefetching,
		refetch,
	} = useQuery(['detailOwner', id], () => getResidentOwner(id || ''), {
		enabled: !!id && action !== 'create',
	});

	const handelCreateProperty = async (data: IPropertyPayload) => {
		try {
			const response = await mutationCreate(data);
			setIdProperty(response?.data?.id);
			toast({ title: 'Tạo mới thành công' });
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdateProperty = async (data: IPropertyPayload) => {
		try {
			await mutationUpdate(data);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmitProperty = (data: DataForm) => {
		const prepareData = {
			...data,
			status: data.status.value as StatusProperty,
			areaId: data.areaId.value as string,
			acreage: Number(data.acreage),
			floorNumber: Number(data.floorNumber),
			inUserAcreage: Number(data.inUserAcreage),
			maxResident: Number(data.maxResident),
			numberOfBathRoom: Number(data.numberOfBathRoom),
			numberOfBedRoom: Number(data.numberOfBedRoom),
			numberOfFloor: Number(data.numberOfFloor),
			id: id || '',
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreateProperty(prepareData) : handelUpdateProperty(prepareData);
	};

	const onChangeOwner = async () => {
		try {
			await mutationUpdateOwner({
				id: id || '',
				newOwner: changeOwnerId,
			});
			toast({ title: 'Đổi chủ sở hữu thành công' });
			onClose();
			refetch();
		} catch (error) {
			toast({ title: 'Đổi chủ sở hữu thất bại', status: 'error' });
		}
	};

	useDidMount(() => {
		if (id) setIdProperty(id);
	});

	if (!!id && (isFetching || isError || !isFetchedingOwner || isRefetching || isFetchingOwner)) return <Loading />;

	const defaultProperty = {
		...detailData?.data,
		status: statusProperty.find(i => i.value === detailData?.data?.status),
		areaId: { label: detailData?.data?.areaName, value: detailData?.data?.areaId },
	};

	const defaultOwner = {
		...dataOwnner,
		identityCardType:
			identityCardType.find(i => i.value === dataOwnner?.identityCardType) || dataOwnner?.identityCardType,
		gender: gender.find(i => i.value === dataOwnner?.gender),
	};

	const isDisabled = action === 'detail';

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				{isErrorOwner && (
					<Alert status="error" display="flex" justifyContent="space-between">
						<Flex>
							<AlertIcon />
							<AlertTitle>Không tìm thấy thông tin chủ sở hữu cho căn hộ này</AlertTitle>
						</Flex>
						<AlertDescription>
							<Button size="sm" variant="brand" onClick={onOpen}>
								Đã có chủ sở hữu
							</Button>
						</AlertDescription>
					</Alert>
				)}

				<Tabs>
					<TabList>
						<Tab>Thông tin căn hộ</Tab>
						<Tab hidden={isErrorOwner || !idProperty}>Thông tin Chủ sở hữu</Tab>
						<Tab hidden={!idProperty || isErrorOwner}>Danh sách cư dân</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<FormContainer
								onSubmit={onSubmitProperty}
								defaultValues={defaultProperty as unknown as { [x: string]: string }}
								validationSchema={validationProperty}
							>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm isDisabled={isDisabled} isRequired label="Mã căn hộ" name="code" variant="admin" />
									<TextFieldHookForm
										isDisabled={isDisabled}
										isRequired
										label="Tên căn hộ"
										name="name"
										variant="admin"
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm isDisabled={isDisabled} label="Loại căn hộ" name="type" />
									<PullDownHookForm
										isDisabled={isDisabled}
										label="Tình trạng xây dựng"
										name="status"
										options={statusProperty}
										isSearchable={false}
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm
										isDisabled={isDisabled}
										type="number"
										label="Tầng"
										name="floorNumber"
										variant="admin"
									/>
									<TextFieldHookForm isDisabled={isDisabled} type="number" label="Block" name="block" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<PullDownHookForm
										label="Phân khu"
										name="areaId"
										isDisabled={isDisabled}
										options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
										onLoadMore={fetchMoreArea}
										isLoading={isLoadingArea}
										onInputChange={setKeyword}
									/>
									<TextFieldHookForm
										isDisabled={isDisabled}
										type="number"
										label="Diện tích đất"
										name="acreage"
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
										isDisabled={isDisabled}
										type="number"
										label="Số phòng ngủ"
										name="numberOfBedRoom"
										variant="admin"
									/>
									<TextFieldHookForm
										isDisabled={isDisabled}
										type="number"
										label="Diện tích sử dụng"
										name="inUserAcreage"
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
										isDisabled={isDisabled}
										type="number"
										label="Địa chỉ"
										name="address"
										variant="admin"
									/>
									<TextFieldHookForm
										isDisabled={isDisabled}
										type="number"
										label="Số phòng tắm"
										name="numberOfBathRoom"
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
										isDisabled={isDisabled}
										type="number"
										label="Số tầng"
										name="numberOfFloor"
										variant="admin"
									/>
									<TextFieldHookForm
										isDisabled={isDisabled}
										type="text"
										label="Hướng"
										name="direction"
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
										isDisabled={isDisabled}
										type="number"
										label="Số lượng cư dân tối đa"
										name="maxResident"
										variant="admin"
									/>
									<TextAreaFieldHookForm isDisabled={isDisabled} label="Mô tả" name="description" variant="admin" />
								</Stack>
								<HStack pt={3} justify="end">
									<Button
										type="button"
										hidden={action !== 'detail' || !permistionAction.UPDATE}
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
										isLoading={isUpdateingProperty || isCreating}
									>
										Lưu
									</Button>
									<Button w="20" onClick={() => history.goBack()} type="button" variant="gray">
										Quay lại
									</Button>
								</HStack>
							</FormContainer>
						</TabPanel>
						<TabPanel>
							<FormContainer defaultValues={defaultOwner as unknown as { [x: string]: string }}>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm
										isDisabled
										type="text"
										isRequired
										label="Họ và tên"
										name="fullName"
										variant="admin"
									/>
									<PullDownHookForm
										isDisabled
										label="Giới tính"
										isRequired
										name="gender"
										options={gender}
										isSearchable={false}
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm
										isDisabled
										type="text"
										label="Ngày sinh"
										isRequired
										name="dateOfBirth"
										variant="admin"
									/>
									<TextFieldHookForm
										type="number"
										isRequired
										label="Số điện thoại"
										name="phoneNumber"
										variant="admin"
										isDisabled
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<PullDownHookForm
										label="Loại giấy tờ tuỳ thân"
										name="identityCardType"
										variant="admin"
										options={identityCardType}
										isRequired
										isDisabled
									/>
									<TextFieldHookForm
										type="number"
										label="CMND/CCCD/Hộ chiếu"
										name="identityCardNumber"
										variant="admin"
										isRequired
										isDisabled
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm
										isDisabled
										type="text"
										label="Địa chỉ thường trú"
										name="permanentAddress"
										variant="admin"
									/>
									<TextFieldHookForm
										isDisabled
										type="text"
										label="Ngày cấp"
										name="identityCreateDate"
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
										isDisabled
										type="text"
										label="Địa chỉ tạm trú"
										name="temporaryAddress"
										variant="admin"
									/>
									<TextFieldHookForm
										isDisabled
										type="text"
										label="Nơi cấp"
										name="identityLocationIssued"
										variant="admin"
									/>
								</Stack>
								<Box pb={3} maxW={{ base: '100%', md: '50%' }}>
									<TextFieldHookForm type="email" label="Email" name="email" variant="admin" />
								</Box>
								<HStack pt={3} justify="end">
									<Button
										isDisabled={!idProperty}
										onClick={() => onOpen()}
										type="button"
										variant="brand"
										hidden={!permistionAction.UPDATE}
									>
										Thay đổi chủ sở hữu
									</Button>
									<Button type="button" variant="gray" onClick={() => history.goBack()}>
										Quay lại
									</Button>
								</HStack>
							</FormContainer>
						</TabPanel>
						<TabPanel>
							<ResidentTab id={idProperty || ''} />
							<HStack pt={3} justify="end">
								<Button type="button" variant="gray" onClick={() => history.goBack()}>
									Quay lại
								</Button>
							</HStack>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Card>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Thay đổi chủ sở hữu</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<PullDown
							placeholder="Chọn chủ sở hữu mới"
							options={dataResident.map(i => ({
								label: `${i.fullName} - ${i.phoneNumber}`,
								value: i.id,
							}))}
							name="resident"
							menuPortalTarget={false}
							onInputChange={setKeywordResident}
							onLoadMore={fetchMoreResident}
							isLoading={isLoadingResident}
							onChange={newValue => setOwnerID(newValue.value as string)}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							isDisabled={!changeOwnerId}
							mr={3}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={onChangeOwner}
							isLoading={isUpdatetingOwner}
						>
							Xác nhận
						</Button>
						<Button w={20} variant="gray" onClick={onClose}>
							Huỷ
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
export default AparmentForm;
