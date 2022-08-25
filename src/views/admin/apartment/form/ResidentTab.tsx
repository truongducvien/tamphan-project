import { Box, Button, Center, Flex, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { alert } from 'components/alertDialog/hook';
import Table, { IColumn } from 'components/table';
import { MdLibraryAdd } from 'react-icons/md';
import { getResidentByProperty } from 'services/resident';
import { gender as genderOptions, IResident, ResidentType, residentType } from 'services/resident/type';
import { PermistionAction } from 'variables/permission';
import { statusOption2 } from 'variables/status';

export const ResidentTab: React.FC<{ id: string }> = ({ id: idApartment }) => {
	const COLUMNS: Array<IColumn<IResident>> = [
		{ key: 'fullName', label: 'Tên cư dân' },
		{ key: 'dateOfBirth', label: 'Ngày sinh' },
		{ key: 'gender', label: 'Giới tính', cell: ({ gender }) => genderOptions.find(i => i.value === gender)?.label },
		{ key: 'identityCardNumber', label: 'CMND/ CCCD/ HC' },
		{ key: 'identityCreateDate', label: 'Ngày cấp' },
		{ key: 'identityLocationIssued', label: 'Nới cấp' },
		{ key: 'propertyName', label: 'Căn hộ' },
		{ key: 'type', label: 'Vai trò', tag: ({ type }) => residentType.find(i => i.value === type) },
		{ key: 'email', label: 'Email' },
		{ key: 'phoneNumber', label: 'Số điện thoại' },
		{ key: 'permanentAddress', label: 'Địa chỉ thường trú' },
		{ key: 'temporaryAddress', label: 'Địa chỉ tạm trú' },
		{ key: 'state', label: 'Trạng thái', tag: ({ state }) => statusOption2.find(i => i.value === state) },
	];

	const { data, isLoading } = useQuery(['listResident'], () => getResidentByProperty(idApartment));

	const handelRemove = async (id: string, fullName: string, type: ResidentType) => {
		if (type === ResidentType.OWNER) {
			await alert({
				title: 'Bạn không xoá cư dân này ra khỏi căn hộ!',
				description: `Họ tên : ${fullName}`,
				type: 'message',
			});
			return;
		}
		await alert({
			title: 'Bạn có muốn xoá cư dân ra khỏi căn hộ ?',
			description: `Họ tên : ${fullName}`,
			type: 'error',
		});
	};

	return (
		<Box>
			<Flex justifyContent="end">
				<Button marginLeft={1} onClick={() => {}} variant="brand" leftIcon={<MdLibraryAdd />}>
					Thêm cư dân
				</Button>
			</Flex>
			<Center mb={5}>
				<Heading as="h6" variant="admin" size="md">
					Danh sách cư dân
				</Heading>
			</Center>
			<Table
				minWith="2000px"
				testId="consignments-dashboard"
				keyField="name"
				columns={COLUMNS}
				data={data?.items || []}
				loading={isLoading}
				action={[PermistionAction.DELETE]}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onClickDelete={({ id, fullName, type }) => handelRemove(id, fullName, type)}
			/>
		</Box>
	);
};
