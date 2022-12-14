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
				title: 'Th??m c?? d??n th??nh c??ng!',
			});
			onSubmit();
			setIds([]);
			onCloseSelected();
		} catch (error) {
			toast({
				title: 'Th??m c?? d??n th???t b???i!',
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
		{ key: 'fullName', label: 'T??n c?? d??n' },
		{ key: 'dateOfBirth', label: 'Ng??y sinh' },
		{ key: 'gender', label: 'Gi???i t??nh', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ng??y c???p' },
		{ key: 'identityLocationIssued', label: 'N??i c???p' },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'S??? ??i???n tho???i' },
		{ key: 'permanentAddress', label: '?????a ch??? th?????ng tr??' },
		{ key: 'temporaryAddress', label: '?????a ch??? t???m tr??' },
		{ key: 'state', label: 'Tr???ng th??i', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const COLUMNS2: Array<IColumn<Omit<IResident, 'property'>>> = [
		{ key: 'fullName', label: 'T??n c?? d??n' },
		{
			key: 'relationship',
			label: 'Quan h??? CSH',
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
		{ key: 'dateOfBirth', label: 'Ng??y sinh' },
		{ key: 'gender', label: 'Gi???i t??nh', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
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
					<ModalHeader textAlign="center">Ch???n c?? d??n</ModalHeader>
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
										<TextFieldHookForm label="T??n c?? d??n" name="fullName" />
										<TextFieldHookForm label="S??? ??i???n tho???i" name="phoneNumber" />
										<Flex mt="3" justifyContent="end">
											<Button type="submit" variant="lightBrand" leftIcon={<SearchIcon />}>
												T??m ki???m
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
							Ti???p theo
						</Button>
						<Button w={20} variant="gray" onClick={onClose}>
							Hu???
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpenSelected} onClose={onCloseSelected} isCentered size="6xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Ch???n m???i quan h???</ModalHeader>
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
							X??c nh???n
						</Button>
						<Button w={20} variant="gray" onClick={onCloseSelected}>
							Hu???
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
			title: 'B???n c?? mu???n xo?? c?? d??n ra kh???i c??n h??? ?',
			type: 'error',
		});
		if (!next) return;
		try {
			await mutationRemove({ id: idProperty, residentIds: ids });
			toast({
				title: 'Xo?? c?? d??n th??nh c??ng!',
			});
			setIds([]);
			refetch();
		} catch (error) {
			toast({
				title: 'Xo?? c?? d??n th???t b???i!',
				status: 'error',
			});
		}
	};

	const COLUMNS: Array<IColumn<IResident>> = [
		{
			key: 'id',
			label: 'Thao t??c',
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
		{ key: 'fullName', label: 'T??n c?? d??n' },
		{
			key: 'relationship',
			label: 'Quan h??? CSH',
			cell: ({ relationship: relationShip, type }) =>
				type === ResidentType.RESIDENT ? relationshipWithOwner.find(i => i.value === relationShip)?.label : '-',
		},
		{ key: 'dateOfBirth', label: 'Ng??y sinh', dateFormat: 'DD/MM/YYYY' },
		{ key: 'gender', label: 'Gi???i t??nh', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ng??y c???p', dateFormat: 'DD/MM/YYYY' },
		{ key: 'identityLocationIssued', label: 'N??i c???p' },
		{ key: 'type', label: 'Vai tr??', tag: ({ type }) => residentType.find(i => i.value === type) },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'S??? ??i???n tho???i' },
		{ key: 'permanentAddress', label: '?????a ch??? th?????ng tr??' },
		{ key: 'temporaryAddress', label: '?????a ch??? t???m tr??' },
		{ key: 'state', label: 'Tr???ng th??i', tag: ({ state }) => statusOption2.find(i => i.value === state) },
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
					Xo?? c?? d??n
				</Button>
				<Button marginLeft={1} onClick={onOpen} variant="brand" leftIcon={<MdLibraryAdd />}>
					Th??m c?? d??n
				</Button>
			</Flex>
			<Center m={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh s??ch c?? d??n
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
