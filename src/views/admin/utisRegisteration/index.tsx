import { useState } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FormContainer } from 'components/form';
import { DatePickerdHookForm } from 'components/form/DatePicker';
import { PullDowndHookForm } from 'components/form/PullDown';
import { TextFieldHookForm } from 'components/form/TextField';
import Table, { DataTable, IColumn } from 'components/table';
import { PermistionAction } from 'variables/permission';

export interface UtilsRe extends DataTable {
	name: string;
	createBy: string;
	phone: string;
	time: string;
	createAt: string;
	qty: string;
	price: string;
	status: string;
	note: string;
	payment: string;
}

const utilsRe: Array<UtilsRe> = [
	{
		name: 'string',
		createBy: 'string',
		phone: 'string',
		time: 'string',
		createAt: 'string',
		qty: 'string',
		price: 'string',
		status: 'string',
		note: 'string',
		payment: 'string',
	},
	{
		name: 'string',
		createBy: 'string',
		phone: 'string',
		time: 'string',
		createAt: 'string',
		qty: 'string',
		price: 'string',
		status: 'string',
		note: 'string',
		payment: 'string',
	},
];

const UtilsReManagement: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(5);

	const COLUMNS: Array<IColumn<UtilsRe>> = [
		{ key: 'name', label: 'Tên tiện ích' },
		{ key: 'createBy', label: 'Tên người đặt' },
		{ key: 'phone', label: 'Số điện thoại' },
		{ key: 'time', label: 'Giờ đặt chỗ' },
		{ key: 'createAt', label: 'Ngày đặt chỗ' },
		{ key: 'qty', label: 'Số lượng' },
		{ key: 'price', label: 'Số tiền đặt cọc' },
		{ key: 'status', label: 'Trạng thái' },
		{ key: 'note', label: 'Mô tả' },
		{ key: 'payment', label: 'Phhương thức thanh toán' },
	];

	const pageInfo = {
		total: 10,
		hasNextPage: true,
		hasPreviousPage: true,
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }} mb={5}>
				<Box px={{ sm: 2, md: 5 }}>
					<FormContainer onSubmit={() => {}}>
						<SimpleGrid columns={{ sm: 1, md: 3 }} spacing={3}>
							<DatePickerdHookForm label="Từ ngày" name="from" />
							<DatePickerdHookForm label="Đến ngày" name="to" />
							<TextFieldHookForm label="Tên tiện ích" name="name" />
							<PullDowndHookForm label="Loại tiện ích" name="type" options={[]} />
							<TextFieldHookForm label="Phân khu" name="subdivision" />
							<Flex align="end" justify="end">
								<Button variant="lightBrand" type="submit" leftIcon={<SearchIcon />}>
									Tìm kiếm
								</Button>
							</Flex>
						</SimpleGrid>
					</FormContainer>
				</Box>
			</Card>
			<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
				<Center mb={5}>
					<Heading as="h6" variant="admin" size="md">
						Danh sách dăng kí tiện ích
					</Heading>
				</Center>
				<Table
					testId="consignments-dashboard"
					minWith="1500px"
					// onSelectionChange={handleSelectionChange}
					keyField="name"
					columns={COLUMNS}
					data={[...utilsRe, ...utilsRe, ...utilsRe]}
					pagination={{
						total: Number(pageInfo?.total || 0),
						pageSize: currentPageSize,
						value: currentPage,
						hasNextPage: pageInfo?.hasNextPage,
						hasPreviousPage: pageInfo?.hasPreviousPage,
						onPageChange: page => setCurrentPage(page),
						onPageSizeChange: pageSize => setCurrentPageSize(pageSize),
					}}
					action={[PermistionAction.EDIT, PermistionAction.DETETE]}
				/>
			</Card>
		</Box>
	);
};

export default UtilsReManagement;
