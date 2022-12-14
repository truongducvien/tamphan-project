import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'src/components/alertDialog/hook';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { BaseOption, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { usePagination } from 'src/hooks/usePagination';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { IPropertyParams } from 'src/services/properties/type';
import { getResidentAuth, residentAuthVoid } from 'src/services/residentAuth';
import { IResidentAuth } from 'src/services/residentAuth/type';
import { authorizationItemOption, IResidentAuthReqParams } from 'src/services/residentAuthReq/type';
import { PermistionAction } from 'src/variables/permission';
import { Status, statusOption2 } from 'src/variables/status';
import * as Yup from 'yup';

interface FormData {
	state?: BaseOption<Status>;
	propertyCode?: BaseOption<string>;
	authorizedPersonName?: string;
	areaId?: BaseOption<string>;
	mandatorName?: string;
}

const validationSchema = Yup.object({
	propertyCode: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	areaId: Yup.object({
		label: Yup.string(),
		value: Yup.string(),
	}).nullable(),
	state: Yup.object({
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
	} = useLoadMore<IArea, IPropertyParams>({
		id: ['listAreaProperty', keywordPropertyDebounce],
		func: getArea,
		payload: { code: keywordPropertyDebounce },
	});

	const { data, isLoading, refetch } = useQuery(
		['listResidentAuth', params, currentPage, pageSize],
		() =>
			getResidentAuth({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const { mutateAsync, isLoading: isDeleing } = useMutation(residentAuthVoid);
	const { toast } = useToastInstance();

	const handleDelete = async (row: IResidentAuth) => {
		try {
			const next = await alert({
				type: 'error',
				title: `B???n c?? ch???n ch???n V?? hi???u uy quy???n c???a ${row.authoredPerson} - ${row.propertyCode}`,
			});
			if (!next) return;
			await mutateAsync(row.id);
			toast({ title: 'V?? hi???u th??nh c??ng' });
			refetch();
		} catch {
			toast({ title: 'V?? hi???u th???t b???i', status: 'error' });
		}
	};

	const COLUMNS: Array<IColumn<IResidentAuth>> = [
		{
			key: 'propertyCode',
			label: 'Thao t??c',
			// eslint-disable-next-line react/no-unstable-nested-components
			cell: row => (
				<Button variant="link" colorScheme="blue" size="sm" onClick={() => handleDelete(row)}>
					V?? hi???u
				</Button>
			),
		},
		{ key: 'propertyCode', label: 'M?? c??n h???' },
		{ key: 'areaName', label: 'Ph??n khu' },
		{
			key: 'authoredPerson',
			label: 'Ng?????i ???????c u??? qu???n',
		},
		{ key: 'authoredPhoneNumber', label: 'S??? ??i???n tho???i' },
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
			label: 'Tr???ng th??i u??? quy???n',
			tag: ({ status }) => statusOption2.find(i => i.value === status),
		},
		{ key: 'updatedDate', label: 'Ng??y c???p nh???t', dateFormat: 'DD/MM/YYYY' },
		{ key: 'modifiedBy', label: 'Ng?????i c???p nh???t' },
	];

	const onSearch = (payload: FormData) => {
		resetPage();
		const preData = {
			...payload,
			state: payload.state?.value,
			areaId: payload.areaId?.value,
			propertyCode: payload.propertyCode?.value,
		};
		setParams(preData);
	};

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={onSearch} onReset={() => setParams({})} validationSchema={validationSchema}>
						<SimpleGrid spacing={5} templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(4, 2fr)' }} gap={6}>
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
							<PullDownHookForm isClearable label="Tr???ng th??i y??u c???u" name="status" options={statusOption2} />
							<TextFieldHookForm name="authorizedPersonName" label="Ng?????i ???????c u??? quy???n" />
						</SimpleGrid>
						<Flex align="end" justify="end" mt={3}>
							<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
								T??m ki???m
							</Button>
						</Flex>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh s??ch u??? quy???n
					</Heading>
				</Center>
				<Table
					loading={isLoading}
					minWidth={2000}
					testId="consignments-dashboard"
					columns={COLUMNS}
					data={data?.items || []}
					pagination={{ value: currentPage, pageSize, ...pagination }}
				/>
			</Card>
		</Box>
	);
};

export default ResdidentAuthReqManagement;
