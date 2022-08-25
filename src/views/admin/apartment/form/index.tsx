import { useState } from 'react';

import {
	Box,
	Button,
	HStack,
	Stack,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Flex,
	Alert,
	AlertIcon,
	AlertDescription,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import useDidMount from 'hooks/useDidMount';
import { useLoadMore } from 'hooks/useLoadMore';
import { Link, useHistory } from 'react-router-dom';
import { createApartment, getApartmentById, updateApartment } from 'services/apartment';
import { IApartmentPayload, StatusApartment, statusApartment } from 'services/apartment/type';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { createResident, getResidentOwner, updateResident } from 'services/resident';
import {
	Gender,
	gender,
	IdentityCardType,
	identityCardType,
	IResidentPayload,
	ResidentType,
} from 'services/resident/type';
import { patchs } from 'variables/patch';
import * as Yup from 'yup';

const validationApartment = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên căn hộ'),
	code: Yup.string().required('Vui lòng nhập tên căn hộ'),
	areaId: Yup.object().shape({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn phân khu') }),
	status: Yup.object().shape({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

const validationSchema = Yup.object({
	fullName: Yup.string().required('Vui lòng nhập họ tên'),
	gender: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn giới tính') }),
	dateOfBirth: Yup.string().required('Vui lòng nhập ngày sinh'),
	phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
	identityCardType: Yup.object({
		label: Yup.string(),
		value: Yup.string().required('Vui lòng chọn loại giấy tờ tuỳ thân'),
	}),
	identityCardNumber: Yup.string().required('Vui lòng nhập giấy tờ tuỳ thân'),
});

interface DataForm1 {
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

interface DataForm2 {
	dateOfBirth: string;
	email: string;
	flatId: string;
	fullName: string;
	gender: Option;
	identityCardNumber: string;
	identityCardType: Option;
	identityCreateDate: string;
	identityLocationIssued: string;
	permanentAddress: string;
	phoneNumber: string;
	temporaryAddress: string;
	type: Option;
	id: string;
}

const AparmentForm: React.FC = () => {
	const [idApartment, setIdApartment] = useState<string>();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const history = useHistory();
	const mutationCreate = useMutation(createApartment);
	const mutationUpdate = useMutation(updateApartment);
	const mutationCreateOwner = useMutation(createResident);
	const mutationUpdateOwner = useMutation(updateResident);

	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { name: keywordDebounce },
	});

	const {
		data: detailData,
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getApartmentById(id || ''), {
		enabled: !!id,
	});

	const {
		data: dataOwnner,
		isFetched: isFetchedingOwner,
		isError: isErrorOwner,
	} = useQuery(['detailOwner', id], () => getResidentOwner(id || ''), {
		enabled: !!id && action !== 'create',
	});

	const handelCreateApartment = async (data: IApartmentPayload) => {
		try {
			const response = await mutationCreate.mutateAsync(data);
			setIdApartment(response?.data?.id);
			toast({ title: 'Tạo mới thành công' });
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdateApartment = async (data: IApartmentPayload) => {
		try {
			await mutationUpdate.mutateAsync(data);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const handelCreateOwner = async (data: IResidentPayload) => {
		try {
			await mutationCreateOwner.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdateOwner = async (data: IResidentPayload) => {
		try {
			await mutationUpdateOwner.mutateAsync(data);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmitApartment = (data: DataForm1) => {
		const prepareData = {
			...data,
			status: data.status.value as StatusApartment,
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
		action === 'create' ? handelCreateApartment(prepareData) : handelUpdateApartment(prepareData);
	};

	const onSubmit = (data: DataForm2) => {
		if (!idApartment) return;
		const prepareData: IResidentPayload = {
			...data,
			propertyId: idApartment,
			gender: (data.gender.value as Gender) || dataOwnner?.gender,
			identityCardType: data.identityCardType.value as IdentityCardType,
			type: ResidentType.OWNER,
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreateOwner(prepareData) : handelUpdateOwner(prepareData);
	};

	useDidMount(() => {
		if (id) setIdApartment(id);
	});

	if (!!id && (isFetching || isError || !isFetchedingOwner)) return null;

	const defaultApartment = {
		...detailData?.data,
		status: statusApartment.find(i => i.value === detailData?.data?.status),
		areaId: { label: detailData?.data?.areaName, value: detailData?.data?.areaId },
	};

	const defaultOwner = {
		...dataOwnner,
		identityCardType:
			identityCardType.find(i => i.value === dataOwnner?.identityCardType) || dataOwnner?.identityCardType,
		gender: gender.find(i => i.value === dataOwnner?.gender),
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				{isErrorOwner && (
					<Alert status="error">
						<AlertIcon />
						<AlertDescription>Không tìm thấy thông tin chủ sở hữu cho căn hộ này</AlertDescription>
					</Alert>
				)}

				<Tabs>
					<TabList>
						<Tab>Thông tin căn hộ</Tab>
						<Tab hidden={isErrorOwner || !idApartment}>Thông tin Chủ sở hữu</Tab>
						<Tab hidden={!idApartment || isErrorOwner}>Dang sách cư dân</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<FormContainer
								onSubmit={onSubmitApartment}
								defaultValues={defaultApartment as unknown as { [x: string]: string }}
								validationSchema={validationApartment}
							>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm isRequired label="Mã căn hộ" name="code" variant="admin" />
									<TextFieldHookForm isRequired label="Tên căn hộ" name="name" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm label="Loại căn hộ" name="type" />
									<PullDowndHookForm
										label="Tình trạng xây dựng"
										name="status"
										options={statusApartment}
										isSearchable={false}
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="number" label="Tầng" name="floorNumber" variant="admin" />
									<TextFieldHookForm type="number" label="Block" name="block" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<PullDowndHookForm
										label="Phân khu"
										name="areaId"
										options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
										onLoadMore={fetchMoreArea}
										isLoading={isLoadingArea}
										onInputChange={setKeyword}
									/>
									<TextFieldHookForm type="number" label="Diện tích đất" name="acreage" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="number" label="Số phòng ngủ" name="numberOfBedRoom" variant="admin" />
									<TextFieldHookForm type="number" label="Diện tích sử dụng" name="inUserAcreage" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="number" label="Địa chỉ" name="address" variant="admin" />
									<TextFieldHookForm type="number" label="Số phòng tắm" name="numberOfBathRoom" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="number" label="Số tầng" name="numberOfFloor" variant="admin" />
									<TextFieldHookForm type="text" label="Hướng" name="direction" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="number" label="Số lượng cư dân tối đa" name="maxResident" variant="admin" />
									<TextAreaFieldHookForm label="Mô tả" name="description" variant="admin" />
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
						</TabPanel>
						<TabPanel>
							<FormContainer
								onSubmit={onSubmit}
								validationSchema={validationSchema}
								defaultValues={defaultOwner as unknown as { [x: string]: string }}
							>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" isRequired label="Họ và tên" name="fullName" variant="admin" />
									<PullDowndHookForm label="Giới tính" isRequired name="gender" options={gender} isSearchable={false} />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Ngày sinh" isRequired name="dateOfBirth" variant="admin" />
									<TextFieldHookForm
										type="number"
										isRequired
										label="Số điện thoại"
										name="phoneNumber"
										variant="admin"
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<PullDowndHookForm
										label="Loại giấy tờ tuỳ thân"
										name="identityCardType"
										variant="admin"
										options={identityCardType}
										isRequired
									/>
									<TextFieldHookForm
										type="number"
										label="CMND/CCCD/Hộ chiếu"
										name="identityCardNumber"
										variant="admin"
										isRequired
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Địa chỉ thường trú" name="permanentAddress" variant="admin" />
									<TextFieldHookForm type="text" label="Ngày cấp" name="identityCreateDate" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Địa chỉ tạm trú" name="temporaryAddress" variant="admin" />
									<TextFieldHookForm type="text" label="Nơi cấp" name="identityLocationIssued" variant="admin" />
								</Stack>
								<Box pb={3} maxW={{ base: '100%', md: '50%' }}>
									<TextFieldHookForm type="email" label="Email" name="email" variant="admin" />
								</Box>
								<HStack pt={3} justify="end">
									{/* {action === 'detail' && (
										<Button type="button" onClick={() => changeAction('edit', id || '')} variant="brand">
											Chỉnh sửa
										</Button>
									)}
									<Button w="20" isDisabled={!idApartment} type="submit" variant="brand">
										Lưu
									</Button> */}
									<Button type="button" variant="gray" onClick={() => history.goBack()}>
										Quay lại
									</Button>
								</HStack>
							</FormContainer>
						</TabPanel>
						<TabPanel>
							<Flex alignItems="center" minH={200} justifyContent="center">
								<Link to={`/admin/${patchs.Resident}/:propertyId=${idApartment || ''}`}>
									<Button variant="link">Quản lý cư dân</Button>
								</Link>
							</Flex>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Card>
		</Box>
	);
};
export default AparmentForm;
