import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdResetTv } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import useActionPage from 'src/hooks/useActionPage';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { usePagination } from 'src/hooks/usePagination';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams } from 'src/services/properties/type';
import { getResidentAuthReq } from 'src/services/residentAuthReq';
import {
	authorizationItemOption,
	authorizationStatusOption,
	IResidentAuthReq,
	IResidentAuthReqParams,
	ResidentAuthReqStatus,
} from 'src/services/residentAuthReq/type';
import { PermistionAction } from 'src/variables/permission';
import * as Yup from 'yup';

interface FormData {
	status?: BaseOption<ResidentAuthReqStatus>;
	propertyCode?: BaseOption<string>;
	authorizedName?: string;
	areaId?: BaseOption<string>;
	mandatorName?: string;
}

const validationSchema = Yup.object({
	areaId: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	propertyCode: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	status: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
});

const ResdidentAuthReqManagement: React.FC = () => {
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebounce = useDebounce(keywordArea);
	const [keywordProperty, setKeywordProperty] = useState('');
	const keywordPropertyDebounce = useDebounce(keywordProperty);

	const [params, setParams] = useState<Omit<IResidentAuthReqParams, 'page' | 'size'>>();

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebounce],
		func: getArea,
		payload: { code: keywordAreaDebounce },
	});

	const {
		data: dataProperty,
		isLoading: isLoadingProperty,
		fetchMore: fetchMoreProperty,
	} = useLoadMore<IProperty, IPropertyParams>({
		id: ['listAreaProperty', keywordPropertyDebounce],
		func: getProperty,
		payload: { code: keywordPropertyDebounce },
	});

	const { data, isLoading } = useQuery(
		['listResidentAuthReq', params, currentPage, pageSize],
		() =>
			getResidentAuthReq({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IResidentAuthReq>> = [
		{ key: 'property', label: 'M?? c??n h???', cell: ({ property }) => property?.code },
		{ key: 'property', label: 'Ph??n khu', cell: ({ property }) => property?.areaName },
		{ key: 'mandator', label: 'Ng?????i y??u c???u', cell: ({ mandator }) => mandator?.fullName },
		{ key: 'mandator', label: 'S??? ??i???n tho???i', cell: ({ mandator }) => mandator?.phoneNumber },
		{
			key: 'authorizationItem',
			label: 'H???ng m???c u??? quy???n',
			tag: ({ authorizationItem }) => authorizationItemOption.find(i => i.value === authorizationItem),
		},
		{ key: 'effectiveDate', label: 'Ng??y hi???u l???c', dateFormat: 'DD/MM/YYYY' },
		{ key: 'expiredDate', label: 'Ng??y k???t th??c', dateFormat: 'DD/MM/YYYY' },
		{ key: 'code', label: 'M?? y??u c???u' },
		{
			key: 'status',
			label: 'Tr???ng th??i y??u c???u',
			tag: ({ status }) => authorizationStatusOption.find(i => i.value === status),
		},
	];

	const onSearch = (payload: FormData) => {
		resetPage();
		const preData = {
			...payload,
			status: payload.status?.value,
			areaId: payload.areaId?.value,
			propertyCode: payload.propertyCode?.value,
		};
		setParams(preData);
	};

	const history = useHistory();
	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} onReset={() => setParams({})} validationSchema={validationSchema}>
						<SimpleGrid spacing={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 2fr)' }} gap={6}>
							<PullDownHookForm
								isClearable
								label="Ph??n khu"
								name="areaId"
								options={dataArea?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeywordArea}
								onLoadMore={fetchMoreArea}
								isLoading={isLoadingArea}
							/>
							<PullDownHookForm
								isClearable
								label="M?? c??n h???"
								name="propertyCode"
								options={dataProperty?.map(i => ({ label: i.code, value: i.id })) || []}
								onInputChange={setKeywordProperty}
								onLoadMore={fetchMoreProperty}
								isLoading={isLoadingProperty}
							/>
							<PullDownHookForm
								isClearable
								label="Tr???ng th??i y??u c???u"
								name="status"
								options={authorizationStatusOption}
							/>
							<TextFieldHookForm name="authorizedName" label="Ng?????i ???????c u??? quy???n" />
							<TextFieldHookForm label="Ng?????i y??u c???u" name="mandatorName" />
							<Flex align="end" justify="end" mt={3}>
								<Button
									variant="lightBrand"
									onClick={() => history.push('/admin/resident-authorization-request/authorization')}
									mr={3}
									type="reset"
									leftIcon={<MdResetTv />}
								>
									Danh s??ch u??? quy???n
								</Button>
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									T??m ki???m
								</Button>
							</Flex>
						</SimpleGrid>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh s??ch y??u c???u u??? quy???n
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					minWidth={2000}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={PermistionAction.VIEW}
					onClickDetail={({ id }) => changeAction('detail', id)}
				/>
			</Card>
		</Box>
	);
};

export default ResdidentAuthReqManagement;
