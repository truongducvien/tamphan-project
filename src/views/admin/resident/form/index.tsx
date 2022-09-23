import { useState } from 'react';

import { Box, Button, Flex, FormControl, FormLabel, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { DatePickerHookForm } from 'src/components/form/DatePicker';
import { Loading } from 'src/components/form/Loading';
import { BaseOption, Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import { PullDown } from 'src/components/pulldown';
import { useToastInstance } from 'src/components/toast';
import { formatDate } from 'src/helpers/dayjs';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams, Relationship, relationshipWithOwner } from 'src/services/properties/type';
import { createResident, getResidentOfProperty, updateResident } from 'src/services/resident';
import {
	Gender,
	gender,
	IdentityCardType,
	identityCardType,
	IResidentPayload,
	ResidentType,
	residentType,
} from 'src/services/resident/type';
import { Status, statusOption2 } from 'src/variables/status';
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
	useNovaId?: boolean;
	state?: Option;
	relationship?: Option;
}

const ResidentForm: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction } = useActionPermission(request);
	const { changeAction, id: ids, action, goback } = useActionPage();
	const arrayIds = ids?.split(',');
	const id = arrayIds?.[0];
	const propertyId = arrayIds?.[1];
	const { toast } = useToastInstance();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const [type, setType] = useState<Option>(residentType[1]);

	const {
		data: dataProperty,
		isLoading: isLoadingProperty,
		fetchMore,
	} = useLoadMore<IProperty, IPropertyParams>({
		id: ['listProperty', keywordDebounce],
		func: getProperty,
		payload: { code: keywordDebounce },
	});

	const {
		data: detailData,
		isFetched,
		isError,
		isLoading,
	} = useQuery(
		['getResidentOfProperty', id, propertyId],
		() => getResidentOfProperty({ id: id || '', propertyId: propertyId || '' }),
		{
			enabled: !!id && !!propertyId,
			onSuccess: ({ data }) => setType(residentType.find(i => i.value === data?.type) || residentType[1]),
		},
	);

	const history = useHistory();
	const { mutateAsync: mutationCreate, isLoading: isCreating } = useMutation(createResident);
	const { mutateAsync: mutationUpdate, isLoading: isUpdating } = useMutation(updateResident);

	const handelCreate = async (data: Omit<IResidentPayload, 'id'>, reset: () => void) => {
		try {
			await mutationCreate(data);
			toast({ title: 'Tạo mới thành công' });
			goback();
			reset();
		} catch {
			toast({ title: 'Tạo mới thất bại', status: 'error' });
		}
	};

	const handelUpdate = async (data: Omit<IResidentPayload, 'id'>) => {
		const prepareData = { ...data, id: id || '' };
		try {
			await mutationUpdate(prepareData);
			toast({ title: 'Cập nhật thành công' });
			goback();
		} catch {
			toast({ title: 'Cập nhật thất bại', status: 'error' });
		}
	};

	const onSubmit = (data: DataForm, reset: () => void) => {
		const prepareData = {
			...data,
			state: data.state?.value as Status,
			type: type?.value as ResidentType,
			identityCardType: data.identityCardType?.value as IdentityCardType,
			gender: data.gender?.value as Gender,
			propertyId: data.propertyId?.value,
			dateOfBirth: formatDate(data?.dateOfBirth, { type: 'BE' }),
			identityCreateDate: formatDate(data?.identityCreateDate, { type: 'BE' }),
			relationship: data?.relationship?.value as Relationship,
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		action === 'create' ? handelCreate(prepareData, reset) : handelUpdate(prepareData);
	};

	if (!!id && !!propertyId && (isError || !isFetched || isLoading)) return <Loading />;

	const defaultValue = {
		...detailData?.data,
		state: statusOption2.find(i => i.value === detailData?.data?.state) || statusOption2[0],
		identityCardType: identityCardType.find(i => i.value === detailData?.data?.identityCardType),
		gender: gender.find(i => i.value === detailData?.data?.gender),
		propertyId: {
			label: detailData?.data?.property?.name,
			value: detailData?.data?.property?.id,
		},
		dateOfBirth: formatDate(detailData?.data?.dateOfBirth),
		identityCreateDate: formatDate(detailData?.data?.identityCreateDate),
		relationship: relationshipWithOwner.find(i => i.value === detailData?.data?.relationship),
		email: detailData?.data?.email || '',
	};

	const isDisabled = action === 'detail';

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px={5} overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<FormContainer
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					defaultValues={defaultValue as unknown as { [x: string]: string }}
				>
					<SimpleGrid spacing={3} columns={{ base: 1, md: 2 }}>
						<TextFieldHookForm isDisabled={isDisabled} isRequired label="Họ và tên" name="fullName" variant="admin" />
						<Flex minW={{ base: '100%', md: '50%' }}>
							<Box width={300} mr={2}>
								<PullDownHookForm
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
						<DatePickerHookForm
							isDisabled={isDisabled}
							label="Ngày sinh"
							isRequired
							name="dateOfBirth"
							variant="admin"
						/>
						<DatePickerHookForm isDisabled={isDisabled} label="Ngày cấp" name="identityCreateDate" variant="admin" />
						<PullDownHookForm
							isDisabled={isDisabled}
							label="Giới tính"
							name="gender"
							isRequired
							options={gender}
							isSearchable={false}
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Nơi cấp" name="identityLocationIssued" variant="admin" />
						<PullDownHookForm
							label="Căn hộ"
							name="propertyId"
							isRequired
							isDisabled={action !== 'create'}
							isLoading={isLoadingProperty}
							onLoadMore={fetchMore}
							onInputChange={setKeyword}
							options={dataProperty.map(i => ({ label: `${i.code} - ${i.name}`, value: i.id }))}
						/>
						<TextFieldHookForm
							isRequired
							isDisabled={isDisabled}
							label="Số điện thoại"
							name="phoneNumber"
							variant="admin"
						/>
						<FormControl isRequired>
							<FormLabel>Vai trò</FormLabel>
							<PullDown
								isDisabled={action !== 'create'}
								name="type"
								value={type}
								onChange={value => setType(value)}
								options={residentType}
								isSearchable={false}
							/>
						</FormControl>
						<TextFieldHookForm isDisabled={isDisabled} label="Email" type="email" name="email" variant="admin" />
						<PullDownHookForm
							isDisabled={isDisabled}
							options={relationshipWithOwner}
							hidden={type.value === ResidentType.OWNER}
							label="Mối quan hệ chủ sở hữu"
							name="relationship"
						/>
						<TextFieldHookForm
							isDisabled={isDisabled}
							label="Địa chỉ thường trú"
							name="permanentAddress"
							variant="admin"
						/>
						<PullDownHookForm
							label="Trạng thái hoạt động"
							name="state"
							isRequired
							isDisabled={isDisabled}
							options={statusOption2}
							isSearchable={false}
						/>
						<TextFieldHookForm
							isDisabled={isDisabled}
							label="Địa chỉ tạm trú"
							name="temporaryAddress"
							variant="admin"
						/>
						<TextFieldHookForm isDisabled={isDisabled} label="Thông tin uỷ quyền" name="uyquyen" variant="admin" />
					</SimpleGrid>
					<HStack pb={3} justifyContent="flex-end">
						<Button
							hidden={!permistionAction.UPDATE || action !== 'detail'}
							type="button"
							onClick={() => changeAction('edit', `${id || ''},${propertyId || ''}`)}
							variant="brand"
						>
							Chỉnh sửa
						</Button>
						<Button
							w="20"
							isLoading={isCreating || isUpdating}
							disabled={action === 'detail'}
							type="submit"
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
export default ResidentForm;
