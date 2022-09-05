/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Checkbox,
	Flex,
	Heading,
	HStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Stack,
	useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import { FormContainer } from 'components/form';
import { BaseOption, PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { IColumn } from 'components/table';
import { useToastInstance } from 'components/toast';
import { useActionPermission } from 'hooks/useActionPermission';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadMore } from 'hooks/useLoadMore';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { getArea } from 'services/area';
import { IArea, IAreaParams } from 'services/area/type';
import { addResident, removeResident } from 'services/properties';
import { getResidentByProperty, getResident } from 'services/resident';
import {
	gender as genderOptions,
	IResident,
	ResidentType,
	residentType,
	IResidentParams,
} from 'services/resident/type';
import { statusOption2 } from 'variables/status';
import * as Yup from 'yup';

const ResidentModal: React.FC<{
	isOpen: boolean;
	defaultArr: string[];
	id: string;
	onClose: () => void;
	onSubmit: () => void;
}> = ({ isOpen, onClose, onSubmit, defaultArr, id }) => {
	const [ids, setIds] = useState<string[]>([]);

	interface Form {
		areaId: BaseOption<string>;
		code: string;
		fullName: string;
	}
	const { toast } = useToastInstance();
	const { mutateAsync: mmutationAdd, isLoading: isAdding } = useMutation(addResident);

	const handleAdd = async () => {
		try {
			await mmutationAdd({ id, residentIds: ids });
			toast({
				title: 'Thêm cư dân thành công!',
			});
			onSubmit();
			setIds([]);
		} catch (error) {
			toast({
				title: 'Thêm cư dân thất bại!',
				status: 'error',
			});
		}
	};

	const validation = Yup.object({
		areaId: Yup.object({ label: Yup.string(), value: Yup.string() }).nullable(),
	});

	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);

	const COLUMNS: Array<IColumn<IResident>> = [
		{
			key: 'id',
			label: '',
			isCenter: true,
			cell: ({ id: idResident }) => (
				<HStack align="center" justify="center" w={10}>
					<Checkbox
						variant="admin"
						isChecked={ids.includes(idResident) || defaultArr.includes(idResident)}
						isDisabled={defaultArr.includes(idResident)}
						onChange={() =>
							setIds(prev =>
								ids.includes(idResident) ? [...prev.filter(i => i !== idResident)] : [...prev, idResident],
							)
						}
					/>
				</HStack>
			),
		},
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp' },
		{ key: 'identityLocationIssued', label: 'Nới cấp' },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const [params, setParams] = useState<IResidentParams>();
	const [keyword, setKeyword] = useState('');
	const keywordDebounce = useDebounce(keyword);

	const {
		data: dataArea,
		isLoading: isLoadingArea,
		fetchMore: fetchMoreArea,
	} = useLoadMore<IArea, IAreaParams>({
		id: ['listArea', keywordDebounce],
		func: getArea,
		payload: { name: keywordDebounce },
	});

	const { data, isLoading } = useQuery(['listResident', params, currentPage, currentPageSize], () =>
		getResident({
			page: currentPage - 1,
			size: currentPageSize,
			...params,
		}),
	);

	const onSearch = (payload: Form) => {
		const prepareData = { ...payload, areaId: payload.areaId?.value };
		setParams(prepareData);
	};

	const pageInfo = {
		total: data?.totalPages,
		hasNextPage: data ? currentPage < data?.totalPages : false,
		hasPreviousPage: data ? currentPage > 0 : false,
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader textAlign="center">Chọn cư dân</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box px={{ sm: 2, md: 5 }}>
						<Box mb={5} display={{ base: 'none', md: 'block' }}>
							<FormContainer onSubmit={onSearch} validationSchema={validation}>
								<Stack
									spacing={5}
									align="end"
									justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
									direction={{ base: 'column', md: 'row' }}
								>
									<TextFieldHookForm label="Mã căn hộ" name="propertyId" />
									<PullDowndHookForm
										name="areaId"
										label="Phân khu"
										options={dataArea.map(i => ({
											label: i.name,
											value: i.id,
										}))}
										onInputChange={setKeyword}
										isClearable
										isLoading={isLoadingArea}
										onLoadMore={fetchMoreArea}
										menuPortalTarget={false}
									/>
									<TextFieldHookForm label="Tên cư dân" name="fullName" />
									<Flex mt="3" justifyContent="end">
										<Button type="submit" variant="lightBrand" leftIcon={<SearchIcon />}>
											Tìm kiếm
										</Button>
									</Flex>
								</Stack>
							</FormContainer>
						</Box>
						<Table
							className="table-tiny"
							maxH="calc(100vh - 500px)"
							overflow="scroll"
							minWith="1500px"
							testId="consignments-dashboard"
							columns={COLUMNS}
							data={data?.items || []}
							loading={isLoading}
							pagination={{
								total: Number(pageInfo?.total || 0),
								pageSize: currentPageSize,
								value: currentPage,
								hasNextPage: pageInfo?.hasNextPage,
								hasPreviousPage: pageInfo?.hasPreviousPage,
								onPageChange: page => setCurrentPage(page),
								onPageSizeChange: pageSize => {
									setCurrentPage(1);
									setCurrentPageSize(pageSize);
								},
							}}
						/>
					</Box>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="blue"
						isDisabled={!ids[0]}
						mr={3}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onClick={handleAdd}
						isLoading={isAdding}
					>
						Xác nhận
					</Button>
					<Button w={20} variant="gray" onClick={onClose}>
						Huỷ
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export const ResidentTab: React.FC<{ id: string }> = ({ id: idProperty }) => {
	const { permistionAction } = useActionPermission('PROPERTIES_MANAGEMENT');

	const { data, isLoading, refetch } = useQuery(['residentByProperty'], () => getResidentByProperty(idProperty));

	const [ids, setIds] = useState<string[]>([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { mutateAsync: mutationRemove, isLoading: isRemoving } = useMutation(removeResident);
	const { toast } = useToastInstance();
	const handelRemove = async () => {
		await alert({
			title: 'Bạn có muốn xoá cư dân ra khỏi căn hộ ?',
			type: 'error',
		});
		try {
			await mutationRemove({ id: idProperty, residentIds: ids });
			toast({
				title: 'Xoá cư dân thành công!',
			});
			refetch();
		} catch (error) {
			toast({
				title: 'Xoá cư dân thất bại!',
				status: 'error',
			});
		}
	};

	const COLUMNS: Array<IColumn<IResident>> = [
		{
			key: 'id',
			label: 'Thao tác',
			isCenter: true,
			cell: ({ id, type }) => (
				<HStack align="center" justify="center">
					<Checkbox
						variant="admin"
						isDisabled={type === ResidentType.OWNER || !permistionAction.UPDATE}
						onChange={() => setIds(prev => (ids.includes(id) ? [...prev.filter(i => i !== id)] : [...prev, id]))}
					/>
				</HStack>
			),
		},
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp' },
		{ key: 'identityLocationIssued', label: 'Nới cấp' },
		{ key: 'type', label: 'Vai trò', tag: ({ type }) => residentType.find(i => i.value === type) },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	return (
		<Box>
			<Flex justifyContent="end" hidden={!permistionAction.UPDATE}>
				<Button
					marginLeft={1}
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onClick={handelRemove}
					variant="delete"
					disabled={!ids[0]}
					leftIcon={<MdDelete />}
					isLoading={isRemoving}
				>
					Xoá cư dân
				</Button>
				<Button marginLeft={1} onClick={onOpen} variant="brand" leftIcon={<MdLibraryAdd />}>
					Thêm cư dân
				</Button>
			</Flex>
			<Center m={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh sách cư dân
				</Heading>
			</Center>
			<Table
				minWith="2000px"
				testId="consignments-dashboard"
				columns={COLUMNS}
				data={data?.items || []}
				loading={isLoading}
			/>
			<ResidentModal
				id={idProperty}
				defaultArr={data?.items.map(i => i.id) || []}
				isOpen={isOpen}
				onClose={onClose}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onSubmit={refetch}
			/>
		</Box>
	);
};
