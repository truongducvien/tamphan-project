import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { MdImportExport, MdLibraryAdd } from 'react-icons/md';
import Card from 'src/components/card/Card';
import { FormContainer } from 'src/components/form';
import { Option, PullDownHookForm } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { BaseComponentProps } from 'src/hocs/withPermission';
import useActionPage from 'src/hooks/useActionPage';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { useDebounce } from 'src/hooks/useDebounce';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { usePagination } from 'src/hooks/usePagination';
import { getArea } from 'src/services/area';
import { IArea, IAreaParams } from 'src/services/area/type';
import { getProperty } from 'src/services/properties';
import { IProperty, IPropertyParams, statusProperty, typeProperty } from 'src/services/properties/type';
import * as Yup from 'yup';

interface SearchForm {
	code?: string;
	areaId?: Option;
}

const validationSchema = Yup.object({
	code: Yup.string(),
	areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
});

const PropertyManagement: React.FC<BaseComponentProps> = ({ request }) => {
	const { permistionAction, actions } = useActionPermission(request);
	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();
	const [keywordArea, setKeywordArea] = useState('');
	const keywordAreaDebound = useDebounce(keywordArea, 500);
	const [param, setParams] = useState<IPropertyParams | null>(null);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordAreaDebound],
		func: getArea,
		payload: { code: keywordAreaDebound },
	});

	const { data, isLoading } = useQuery(
		['listProperty', param, currentPage, pageSize],
		() => getProperty({ ...param, page: currentPage - 1, size: pageSize }),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const COLUMNS: Array<IColumn<IProperty>> = [
		{ key: 'code', label: 'M?? c??n h???' },
		{ key: 'name', label: 'T??n c??n h???' },
		{ key: 'type', label: 'Lo???i c??n h???', tag: ({ type }) => typeProperty.find(i => i.value === type) },
		{ key: 'status', label: 'Tr???ng th??i', tag: ({ status }) => statusProperty.find(i => i.value === status) },
		{ key: 'acreage', label: 'Di???n t??ch' },
		{ key: 'numberOfBedRoom', label: 'S??? PH??NG NG???' },
		{ key: 'numberOfBathRoom', label: 'S??? ph??ng t???m' },
		{ key: 'numberOfFloor', label: 'S??? T???ng' },
		{ key: 'areaName', label: 'Ph??n khu' },
	];

	const onSearch = (payload: SearchForm) => {
		resetPage();
		setParams({ ...payload, areaId: payload.areaId?.value as string });
	};

	const { changeAction } = useActionPage();

	return (
		<Box pt="10px">
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer validationSchema={validationSchema} onSubmit={onSearch}>
						<Stack
							spacing={5}
							align="end"
							justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
							direction={{ base: 'column', md: 'row' }}
						>
							<TextFieldHookForm name="code" label="M?? c??n h???" />
							<PullDownHookForm
								name="areaId"
								label="Ph??n khu"
								isClearable
								onInputChange={setKeywordArea}
								isLoading={isLoadingArea}
								onLoadMore={fetchMoreArea}
								options={dataArea.map(i => ({ label: i.name, value: i.id })) || []}
							/>
							<Flex>
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									T??m ki???m
								</Button>
								<Button marginLeft={1} variant="light" leftIcon={<MdImportExport />}>
									Import
								</Button>
								<Button
									onClick={() => changeAction('create')}
									marginLeft={1}
									variant="brand"
									leftIcon={<MdLibraryAdd />}
									hidden={!permistionAction.ADD}
								>
									Th??m m???i
								</Button>
							</Flex>
						</Stack>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="10px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh s??ch c??n h???
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWith="2000px"
					columns={COLUMNS}
					data={data?.items || []}
					loading={isLoading}
					pagination={{ value: currentPage, pageSize, ...pagination }}
					action={actions}
					onClickDetail={({ id }) => changeAction('detail', id)}
					onClickEdit={({ id }) => changeAction('edit', id)}
				/>
			</Card>
		</Box>
	);
};

export default PropertyManagement;
