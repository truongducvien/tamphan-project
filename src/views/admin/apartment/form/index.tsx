import { useState } from 'react';

import { Box, Button, HStack, Stack, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { Option, PullDowndHookForm } from 'components/form/PullDown';
import { TextAreaFieldHookForm } from 'components/form/TextAreaField';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useHistory } from 'react-router-dom';
import { createApartment, getApartmentById, updateApartment } from 'services/apartment';
import { IApartmentPayload, StatusApartment, statusApartment } from 'services/apartment/type';
import { getArea } from 'services/area';
import * as Yup from 'yup';

const validationApartment = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên căn hộ'),
	code: Yup.string().required('Vui lòng nhập tên căn hộ'),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn phân khu') }),
	status: Yup.object({ label: Yup.string(), value: Yup.string().required('Vui lòng chọn trạng thái') }),
});

const validationSchema = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên nhóm'),
});

interface DataForm1 {
	acreage: number;
	address: string;
	areaId: Option;
	block: string;
	code: string;
	description: string;
	direction: string;
	floorNumber: number;
	inUserAcreage: number;
	maxResident: number;
	name: string;
	numberOfBathRoom: number;
	numberOfBedRoom: number;
	numberOfFloor: number;
	status: Option;
	type: string;
}

const AparmentForm: React.FC = () => {
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const history = useHistory();
	const mutationCreate = useMutation(createApartment);
	const mutationUpdate = useMutation(updateApartment);

	const { changeAction, id, action } = useActionPage();
	const { toast } = useToastInstance();

	const {
		data: detailData,
		isFetching,
		isError,
	} = useQuery(['detail', id], () => getApartmentById(id || ''), {
		enabled: !!id,
	});

	const { data: dataArea, isFetched } = useQuery(['listArea', keywordDebounce], () =>
		getArea({
			name: keywordDebounce,
		}),
	);

	const handelCreate = async (data: IApartmentPayload, reset: () => void) => {
		try {
			await mutationCreate.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: IApartmentPayload) => {
		try {
			await mutationUpdate.mutateAsync(data);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmitApartment = (data: DataForm1, reset: () => void) => {
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
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	const onSubmit = (data: DataForm1) => {};

	if (isFetching || isError || !isFetched) return null;

	const defaultApartment = {
		...detailData?.data,
		status: statusApartment.find(i => i.value === detailData?.data?.status),
		areaId: dataArea?.items.map(i => ({ label: i.name, value: i.id })).find(i => i.value === detailData?.data?.areaId),
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Tabs>
					<TabList>
						<Tab>Thông tin căn hộ</Tab>
						<Tab>Thông tin Chủ sở hữu</Tab>
						<Tab>Dang sách cư dân</Tab>
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
										options={dataArea?.items.map(i => ({ label: i.name, value: i.id })) || []}
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
						</TabPanel>
						<TabPanel>
							<FormContainer onSubmit={onSubmit} validationSchema={validationSchema}>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Họ và tên" name="fullName" variant="admin" />
									<PullDowndHookForm
										label="Giới tính"
										name="gender"
										options={[
											{
												label: 'Nam',
												value: 'nam',
											},
											{
												label: 'Nữ',
												value: 'nữ',
											},
										]}
										isSearchable={false}
									/>
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Ngày sinh" name="birthday" variant="admin" />
									<TextFieldHookForm type="number" label="Số điện thoại" name="phone" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="email" label="Email" name="email" variant="admin" />
									<TextFieldHookForm type="number" label="CMND/CCCD/Hộ chiếu" name="cmnd" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Địa chỉ thường trú" name="address" variant="admin" />
									<TextFieldHookForm type="text" label="Ngày cấp" name="datecmd" variant="admin" />
								</Stack>
								<Stack
									justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
									direction={{ base: 'column', md: 'row' }}
									spacing={3}
									pb={3}
								>
									<TextFieldHookForm type="text" label="Địa chỉ tạm trú" name="currentAddress" variant="admin" />
									<TextFieldHookForm type="text" label="Nơi cấp" name="addressCmnd" variant="admin" />
								</Stack>
							</FormContainer>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Card>
		</Box>
	);
};
export default AparmentForm;
