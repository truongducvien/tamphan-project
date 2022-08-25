import { useState } from 'react';

import { Box, Button, Flex, HStack, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { BaseOption, Option, PullDowndHookForm } from 'components/form/PullDown';
import { SwichHookForm } from 'components/form/SwichHookForm';
import { TextFieldHookForm } from 'components/form/TextField';
import { useToastInstance } from 'components/toast';
import useActionPage from 'hooks/useActionPage';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { useHistory } from 'react-router-dom';
import { getApartment } from 'services/apartment';
import { IApartment, IApartmentParams } from 'services/apartment/type';
import { createResident, getResidentOfProperty, updateResident } from 'services/resident';
import {
	Gender,
	gender,
	IdentityCardType,
	identityCardType,
	IResidentPayload,
	ResidentType,
	residentType,
} from 'services/resident/type';
import { Status, statusOption2 } from 'variables/status';
import * as Yup from 'yup';

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
	propertyId: Yup.object({
		label: Yup.string(),
		value: Yup.string().required('Vui lòng chọn căn hộ'),
	}),
});

interface DataForm {
	dateOfBirth: string;
	email: string;
	propertyId: BaseOption<string>;
	propertyName?: string;
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
	useNovaId?: boolean;
	state?: Option;
}

const ResidentForm: React.FC = () => {
	const { changeAction, id: ids, action } = useActionPage();
	const arrayIds = ids?.split(',');
	const id = arrayIds?.[0];
	const propertyId = arrayIds?.[1];
	const { toast } = useToastInstance();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const {
		data: dataApartment,
		isLoading: isLoadingApartment,
		fetchMore,
	} = useLoadMore<IApartment, IApartmentParams>({
		id: ['listApartment', keywordDebounce],
		func: getApartment,
		payload: { code: keywordDebounce },
	});

	const {
		data: detailData,
		isFetched,
		isError,
	} = useQuery(
		['getResidentOfProperty', id, propertyId],
		() => getResidentOfProperty({ id: id || '', propertyId: propertyId || '' }),
		{
			enabled: !!id && !!propertyId,
		},
	);

	const history = useHistory();
	const mutationCreate = useMutation(createResident);
	const mutationUpdate = useMutation(updateResident);

	const handelCreate = async (data: Omit<IResidentPayload, 'id'>, reset: () => void) => {
		try {
			await mutationCreate.mutateAsync(data);
			toast({ title: 'Tạo mới thành công' });
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: Omit<IResidentPayload, 'id'>) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate.mutateAsync(prepareData);
			toast({ title: 'Cập nhật thành công' });
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const prepareData = {
			...data,
			state: data.state?.value as Status,
			type: data.type?.value as ResidentType,
			identityCardType: data.identityCardType?.value as IdentityCardType,
			gender: data.gender?.value as Gender,
			propertyId: data.propertyId?.value,
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && !!propertyId && (isError || !isFetched)) return null;

	const defaultValue = {
		...detailData?.data,
		state: statusOption2.find(i => i.value === detailData?.data?.state),
		type: residentType.find(i => i.value === detailData?.data?.type),
		identityCardType: identityCardType.find(i => i.value === detailData?.data?.identityCardType),
		gender: gender.find(i => i.value === detailData?.data?.gender),
		propertyId: {
			label: detailData?.data?.propertyName,
			value: detailData?.data?.propertyId,
		},
	};

	const isDisabled = action === 'detail';

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={defaultValue as unknown as { [x: string]: string }}
				>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Họ và tên" name="fullName" variant="admin" />
						<Flex minW={{ base: '100%', md: '50%' }}>
							<Box width={300} mr={2}>
								<PullDowndHookForm
									label="Loại giấy tờ tuỳ thân"
									name="identityCardType"
									variant="admin"
									options={identityCardType}
									isRequired
									isDisabled={isDisabled}
								/>
							</Box>
							<TextFieldHookForm
								isDisabled={isDisabled}
								isRequired
								label="CMND.CCCD/Hộ chiếu"
								name="identityCardNumber"
								variant="admin"
							/>
						</Flex>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm
							isDisabled={isDisabled}
							label="Ngày sinh"
							isRequired
							name="dateOfBirth"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Ngày cấp" name="identityCreateDate" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							isDisabled={isDisabled}
							label="Giới tính"
							name="gender"
							isRequired
							options={gender}
							isSearchable={false}
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Nơi cấp" name="identityLocationIssued" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							label="Căn hộ"
							name="propertyId"
							isRequired
							isDisabled={action !== 'create'}
							isLoading={isLoadingApartment}
							onLoadMore={fetchMore}
							options={dataApartment.map(i => ({ label: `${i.code} - ${i.name}`, value: i.id }))}
							onInputChange={setKeyword}
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Số điện thoại" name="phoneNumber" variant="admin" />
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<PullDowndHookForm
							isDisabled={action !== 'create'}
							label="Vai trò"
							name="type"
							isRequired
							options={residentType}
							isSearchable={false}
						/>
						<TextFieldHookForm
							isDisabled={isDisabled}
							isRequired
							label="Email"
							type="email"
							name="email"
							variant="admin"
						/>
					</Stack>
					<Stack
						justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
						direction={{ base: 'column', md: 'row' }}
						spacing={3}
						pb={3}
					>
						<TextFieldHookForm isDisabled={isDisabled} label="Mối quan hệ chủ sở hữu" name="role" />
						<TextFieldHookForm
							isDisabled={isDisabled}
							isRequired
							label="Địa chỉ thường trú"
							name="permanentAddress"
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
							label="Trạng thái hoạt động"
							name="state"
							isRequired
							isDisabled={isDisabled}
							options={statusOption2}
							isSearchable={false}
						/>
						<TextFieldHookForm
							isDisabled={isDisabled}
							isRequired
							label="Địa chỉ tạm trú"
							name="temporaryAddress"
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
							isRequired
							label="Thông tin uỷ quyền"
							name="uyquyen"
							variant="admin"
						/>
						<TextFieldHookForm label="Ngày cập nhật" isDisabled name="createAt" variant="admin" />
					</Stack>
					<Box>
						{/* <Swich label="Cho phép sử dụng NOVAID" id="useNovaId" /> */}
						<SwichHookForm label="Cho phép sử dụng NOVAID" name="useNovaId" variant="admin" />
					</Box>
					<HStack pb={3} justifyContent="flex-end">
						{action === 'detail' && (
							<Button
								type="button"
								onClick={() => changeAction('edit', `${id || ''},${propertyId || ''}`)}
								variant="brand"
							>
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
export default ResidentForm;
