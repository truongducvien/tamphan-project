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
	Select,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdDelete, MdLibraryAdd } from 'react-icons/md';
import { alert } from 'src/components/alertDialog/hook';
import { FormContainer } from 'src/components/form';
import { BaseOption } from 'src/components/form/PullDown';
import { TextFieldHookForm } from 'src/components/form/TextField';
import Table, { IColumn } from 'src/components/table';
import { useToastInstance } from 'src/components/toast';
import { useActionPermission } from 'src/hooks/useActionPermission';
import { usePagination } from 'src/hooks/usePagination';
import { addResident, removeResident } from 'src/services/properties';
import { RelationshipWithOwner, relationshipWithOwner } from 'src/services/properties/type';
import { getResidentByProperty, getResidentV2 } from 'src/services/resident';
import {
	gender as genderOptions,
	IResident,
	ResidentType,
	residentType,
	IResidentParams,
} from 'src/services/resident/type';
import { statusOption2 } from 'src/variables/status';

const ResidentModal: React.FC<{
	isOpen: boolean;
	defaultArr: string[];
	id: string;
	onClose: () => void;
	onSubmit: () => void;
}> = ({ isOpen, onClose, onSubmit, defaultArr, id }) => {
	const [ids, setIds] = useState<Array<Omit<IResident, 'property'>>>([]);
	const { isOpen: isOpenSelected, onOpen: onOpenSelected, onClose: onCloseSelected } = useDisclosure();
	interface Form {
		areaId: BaseOption<string>;
		code: string;
		fullName: string;
	}
	const { toast } = useToastInstance();
	const { mutateAsync: mmutationAdd, isLoading: isAdding } = useMutation(addResident);

	const handleAdd = async () => {
		try {
			await mmutationAdd({
				id,
				requests: ids.map(i => ({ residentId: i.id, relationshipWithOwner: i.relationship || 'OTHER' })),
			});
			toast({
				title: 'Thêm cư dân thành công!',
			});
			onSubmit();
			setIds([]);
			onCloseSelected();
		} catch (error) {
			toast({
				title: 'Thêm cư dân thất bại!',
				status: 'error',
			});
		}
	};

	const { resetPage, dispatchInfo, value: currentPage, pageSize, ...pagination } = usePagination();

	const COLUMNS: Array<IColumn<Omit<IResident, 'property'>>> = [
		{
			key: 'id',
			label: '',
			isCenter: true,
			cell: row => {
				const { id: idResident } = row;
				return (
					<HStack align="center" justify="center" w={10}>
						<Checkbox
							variant="admin"
							isChecked={!!ids.find(i => i.id === idResident) || defaultArr.includes(idResident)}
							isDisabled={defaultArr.includes(idResident)}
							onChange={() =>
								setIds(prev =>
									ids.find(i => i.id === idResident) ? [...prev.filter(i => i.id !== idResident)] : [...prev, row],
								)
							}
						/>
					</HStack>
				);
			},
		},
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp' },
		{ key: 'identityLocationIssued', label: 'Nơi cấp' },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const COLUMNS2: Array<IColumn<Omit<IResident, 'property'>>> = [
		{ key: 'fullName', label: 'Tên cư dân' },
		{
			key: 'relationship',
			label: 'Quan hệ CSH',
			cell: row => {
				return (
					<Select
						name="relationship"
						variant="admin"
						onChange={e =>
							setIds(prev => {
								const currentIdx = [...prev].findIndex(ii => row.id === ii.id);
								const newData = [...prev];
								newData[currentIdx] = { ...newData[currentIdx], relationship: e.target.value as RelationshipWithOwner };
								return newData;
							})
						}
					>
						{relationshipWithOwner.map(i => (
							<option value={i.value}>{i.label}</option>
						))}
					</Select>
				);
			},
		},
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
	];

	const [params, setParams] = useState<IResidentParams>();

	const { data, isLoading } = useQuery(
		['listResident', params, currentPage, pageSize],
		() =>
			getResidentV2({
				page: currentPage - 1,
				size: pageSize,
				...params,
			}),
		{ onSuccess: d => dispatchInfo(d) },
	);

	const onSearch = (payload: Form) => {
		resetPage();
		const prepareData = { ...payload, areaId: payload.areaId?.value };
		setParams(prepareData);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Chọn cư dân</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box px={{ sm: 2, md: 5 }}>
							<Box mb={5} display={{ base: 'none', md: 'block' }}>
								<FormContainer onSubmit={onSearch}>
									<Stack
										spacing={5}
										align="end"
										justify={{ base: 'center', md: 'space-around', xl: 'space-around' }}
										direction={{ base: 'column', md: 'row' }}
									>
										<TextFieldHookForm label="Tên cư dân" name="fullName" />
										<TextFieldHookForm label="Số điện thoại" name="phoneNumber" />
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
								pagination={{ value: currentPage, pageSize, ...pagination }}
							/>
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							isDisabled={!ids?.[0]}
							mr={3}
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={() => {
								onClose();
								onOpenSelected();
							}}
							isLoading={isAdding}
						>
							Tiếp theo
						</Button>
						<Button w={20} variant="gray" onClick={onClose}>
							Huỷ
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpenSelected} onClose={onCloseSelected} isCentered size="6xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Chọn mối quan hệ</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Table
							maxH="calc(100vh - 500px)"
							className="table-tiny"
							overflow="scroll"
							testId="consignments-dashboard"
							columns={COLUMNS2}
							data={ids}
						/>
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
						<Button w={20} variant="gray" onClick={onCloseSelected}>
							Huỷ
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
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
		const next = await alert({
			title: 'Bạn có muốn xoá cư dân ra khỏi căn hộ ?',
			type: 'error',
		});
		if (!next) return;
		try {
			await mutationRemove({ id: idProperty, residentIds: ids });
			toast({
				title: 'Xoá cư dân thành công!',
			});
			setIds([]);
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
		{
			key: 'relationship',
			label: 'Quan hệ CSH',
			cell: ({ relationship: relationShip, type }) =>
				type === ResidentType.RESIDENT ? relationshipWithOwner.find(i => i.value === relationShip)?.label : '-',
		},
		{ key: 'dateOfBirth', label: 'Ngày sinh', dateFormat: 'DD/MM/YYYY' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp', dateFormat: 'DD/MM/YYYY' },
		{ key: 'identityLocationIssued', label: 'Nơi cấp' },
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
